<?php
// =============================================
// 입찰 공고 모니터링 시스템 - index.php
// 좌측 필터 패널 + 우측 카드형 리스트
// =============================================

require_once 'config.php';
require_once 'db.php';
require_once __DIR__ . '/src/autoload.php';

use BiddingMonitor\Core\DeadlineExtractor;

/** DB 마감일 없을 때 접수/게재 기간 문자열에서 표시용 날짜 */
function displayDeadlineForBid(array $bid): ?string
{
    $date = trim((string)($bid['deadline_date'] ?? ''));
    if ($date !== '' && $date !== '1970-01-01') {
        return $date;
    }
    $period = trim((string)($bid['receipt_period'] ?? ''));
    if ($period === '') {
        return null;
    }
    return DeadlineExtractor::fromPeriodText($period, true);
}

function getDeadlineClass(string $dateStr): string {
    if ($dateStr === '') return 'normal';
    $diff = (strtotime($dateStr) - strtotime('today')) / 86400;
    if ($diff <= 3) return 'urgent';
    if ($diff <= 7) return 'soon';
    return 'normal';
}

function getSourceClass(string $source): string {
    $map = [
        '나라장터' => 'source-nara', 'K-스타트업' => 'source-kstartup',
        '중소벤처24' => 'source-smes24', '기업마당' => 'source-bizinfo',
        '중소기업기술정보진흥원' => 'source-smtech', 'IITP' => 'source-iitp',
        '천안시 고시공고' => 'source-local', '충청남도 도정공고' => 'source-local',
    ];
    return $map[$source] ?? 'source-nara';
}

// 태그: 복수 선택. GET tag[] 또는 tags=1,2,3 또는 (구) tag=단일
$tags = [];
if (isset($_GET['tag'])) {
    if (is_array($_GET['tag'])) {
        $tags = array_filter(array_map('intval', $_GET['tag']));
    } else {
        $tags = (int)$_GET['tag'] ? [(int)$_GET['tag']] : [];
    }
} elseif (!empty($_GET['tags'])) {
    $tags = array_filter(array_map('intval', explode(',', (string)$_GET['tags'])));
}
$filters = [
    'search'   => trim($_GET['search'] ?? ''),
    'source'   => trim($_GET['source'] ?? ''),
    'sources'  => isset($_GET['sources']) && $_GET['sources'] !== '' ? array_filter(array_map('trim', explode(',', (string)$_GET['sources']))) : [],
    'deadline' => trim($_GET['deadline'] ?? ''),
    'tags'     => $tags,
    'from'     => trim($_GET['from'] ?? ''),
    'to'       => trim($_GET['to'] ?? ''),
    'sort'     => trim($_GET['sort'] ?? 'newest'),
    'page'     => max(1, (int)($_GET['page'] ?? 1)),
    'per_page' => (function () {
        $raw = $_GET['per_page'] ?? 10;
        $pp = is_array($raw) ? 10 : (int)$raw;
        return in_array($pp, [10, 20, 30, 50], true) ? $pp : 10;
    })(),
];

$db = new Database();

// ── 회사 선택(회사별 관련 공고 보기) 모드 ──
$companyOnly  = (string)($_GET['company_only'] ?? '') === '1';
$companyId    = (int)($_GET['company_id'] ?? 0);
$eligibleOnly = (string)($_GET['eligible_only'] ?? '1') !== '0';
$minScore     = max(0, (int)($_GET['min_score'] ?? 40));

// 회사 모드: 정렬 기본값을 점수순으로(안내·DB와 일치). 전체 목록은 기존처럼 최신순 기본.
$allowedCompanySort = ['score', 'scored', 'newest', 'deadline', 'amount'];
if ($companyOnly && $companyId > 0) {
    $s = trim($_GET['sort'] ?? 'score');
    $filters['sort'] = in_array($s, $allowedCompanySort, true) ? $s : 'score';
}

if ($companyOnly && $companyId > 0) {
    $page = max(1, (int)($_GET['page'] ?? 1));
    $per_page = (function () {
        $raw = $_GET['per_page'] ?? 10;
        $pp = is_array($raw) ? 10 : (int)$raw;
        return in_array($pp, [10, 20, 30, 50], true) ? $pp : 10;
    })();
    $company = $db->getCompanyBy('id', $companyId);
    if (!$company) {
        $bids = [];
        $total = 0;
        $total_pages = 1;
    } else {
        // 총계: SQL childcare 제외 등과 맞춘 DB 카운트( PHP만 추가로 제외하는 건 소수라 페이지는 대체로 맞음 )
        // 회사 모드에서도 사이드바 필터(사이트/검색/마감일/태그/기간)를 함께 적용한다.
        $companyListFilters = [
            'search'   => $filters['search'] ?? '',
            'sources'  => $filters['sources'] ?? [],
            'source'   => $filters['source'] ?? '',
            'deadline' => $filters['deadline'] ?? '',
            'tags'     => $filters['tags'] ?? [],
            'from'     => $filters['from'] ?? '',
            'to'       => $filters['to'] ?? '',
        ];
        $total = $db->getCompanyModeScoredListTotal(
            $company,
            $companyId,
            $minScore,
            $eligibleOnly,
            $filters['sort'],
            5000,
            $companyListFilters
        );
        $bids = $db->fetchScoredBidsPageWithCompanyListFilters(
            $company,
            $companyId,
            $minScore,
            $per_page,
            $page,
            $eligibleOnly,
            50,
            20000,
            $filters['sort'],
            5000,
            $companyListFilters
        );
        $total_pages = (int)ceil(max(1, $total) / $per_page);
    }
} else {
    $result = $db->getBids($filters);
    $bids = $result['data'];
    $total = $result['total'];
    $per_page = $result['per_page'];
    $page = $result['page'];
    $total_pages = (int)ceil($total / $per_page);
}

$stats = $db->getStats();
$keywords = $db->getKeywords();
$source_counts = $db->getSourceCounts($filters);
$tag_counts = $db->getTagCounts($filters);
$all_source_counts = $db->getSourceCounts([]);
$hero_total_bids = (int)($all_source_counts['전체'] ?? 0);
$hero_source_count = max(0, count($all_source_counts) - 1);
// 엑셀 다운로드
if (isset($_GET['export'])) {
    require_once 'export.php';
    $selected = isset($_GET['ids']) ? array_filter(array_map('intval', explode(',', $_GET['ids'] ?? ''))) : [];
    exportExcel($db, $selected, $filters);
    exit;
}
?>
<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>공고 매칭</title>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://portal.platformers.kr/assets/portal-header.css?v=1">
<style>
:root {
  --bg:#f4f6fb; --surface:#fff; --surface2:#f8fafc; --border:#e2e8f0; --accent:#2563eb;
  --accent-hover:#1d4ed8; --accent-light:#eff6ff; --green:#059669; --orange:#d97706; --red:#dc2626;
  --text:#0f172a; --text-muted:#64748b; --text-dim:#94a3b8;
  --hero-grad:linear-gradient(135deg,#eff6ff 0%,#f8fafc 55%,#f4f6fb 100%);
  --shadow-sm:0 1px 2px rgba(15,23,42,.04);
  --shadow-md:0 8px 24px rgba(15,23,42,.06);
  --layout-max:1680px;
  --layout-pad:16px;
}
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Noto Sans KR',sans-serif;background:var(--bg);color:var(--text);min-height:100vh}

.header-actions{display:flex;align-items:center;gap:12px;flex-wrap:wrap;flex-shrink:0}
.header-link{padding:9px 16px;border-radius:10px;font-size:13px;font-weight:500;text-decoration:none;color:var(--text);border:1px solid var(--border);background:#fff;transition:all .15s;white-space:nowrap}
.header-link:hover{color:var(--accent);border-color:#cbd5e1;background:#f8fafc}

.page-hero{max-width:var(--layout-max);margin:0 auto;padding:16px var(--layout-pad) 0}
.hero-inner{background:#fff;border:1px solid var(--border);border-radius:14px;padding:16px 18px;box-shadow:var(--shadow-sm)}

.main-layout{display:flex;max-width:var(--layout-max);margin:0 auto;padding:12px var(--layout-pad) 20px;gap:20px;align-items:flex-start}
.sidebar{width:248px;flex-shrink:0;position:sticky;top:88px}
.content{flex:1;min-width:0}

.filter-panel{background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:20px;box-shadow:var(--shadow-sm)}
.filter-title{font-size:13px;font-weight:600;color:var(--text-muted);margin-bottom:12px}
.search-wrap{position:relative;margin-bottom:20px}
.search-input{width:100%;background:var(--surface2);border:1px solid var(--border);border-radius:8px;padding:10px 14px 10px 36px;font-size:14px;outline:none;transition:border-color .2s}
.search-input:focus{border-color:var(--accent)}
.search-icon{position:absolute;left:12px;top:50%;transform:translateY(-50%);color:var(--text-dim);cursor:pointer}
.suggest-list{position:absolute;top:100%;left:0;right:0;background:var(--surface);border:1px solid var(--border);border-radius:8px;margin-top:4px;max-height:200px;overflow-y:auto;z-index:50;box-shadow:0 4px 12px rgba(0,0,0,.1)}
.suggest-item{display:block;padding:10px 14px;font-size:13px;color:var(--text);text-decoration:none;border-bottom:1px solid var(--border)}
.suggest-item:last-child{border-bottom:none}
.suggest-item:hover{background:var(--accent-light)}

.filter-group{margin-bottom:20px}
.filter-group:last-child{margin-bottom:0}
.filter-label{font-size:11px;font-weight:600;color:var(--text-dim);text-transform:uppercase;letter-spacing:.05em;margin-bottom:8px}
.filter-options{display:flex;flex-direction:column;gap:6px}
.filter-link{display:flex;align-items:center;justify-content:space-between;padding:8px 12px;border-radius:6px;font-size:13px;color:var(--text-muted);text-decoration:none;transition:all .15s}
.filter-link:hover{background:var(--surface2);color:var(--text)}
.filter-link.active{background:var(--accent-light);color:var(--accent);font-weight:500}
.filter-link .count{font-size:11px;color:var(--text-dim);background:var(--surface2);padding:2px 8px;border-radius:10px}

.multi-select{position:relative}
.multi-select-toggle{width:100%;padding:8px 12px;border-radius:6px;border:1px solid var(--border);background:var(--surface);font-size:13px;display:flex;align-items:center;justify-content:space-between;cursor:pointer}
.multi-select-toggle span{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.multi-select-menu{position:absolute;top:110%;left:0;right:0;background:var(--surface);border:1px solid var(--border);border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,.1);z-index:60;max-height:220px;overflow-y:auto;padding:6px 0;display:none}
.multi-select-item{display:flex;align-items:center;justify-content:space-between;padding:6px 12px;font-size:13px;cursor:pointer;gap:6px}
.multi-select-item input{margin-right:6px}
.multi-select-item:hover{background:var(--accent-light)}

.tag-btns{display:flex;flex-wrap:wrap;gap:6px}
.tag-btn{display:inline-block;padding:6px 12px;border-radius:6px;font-size:12px;background:var(--surface2);color:var(--text-muted);border:1px solid var(--border);text-decoration:none;transition:all .15s}
.tag-btn:hover{background:var(--accent-light);color:var(--accent);border-color:var(--accent)}
.tag-btn.active{background:var(--accent);color:#fff;border-color:var(--accent)}

.period-select{width:100%;padding:8px 12px;border-radius:6px;border:1px solid var(--border);font-size:13px;background:var(--surface);margin-bottom:8px}
.btn-filter{padding:8px 16px;border-radius:6px;font-size:13px;background:var(--accent);color:#fff;border:none;cursor:pointer;width:100%;margin-top:12px}
.btn-filter:hover{background:var(--accent-hover)}

.toolbar{display:flex;align-items:center;gap:12px;margin-bottom:20px;flex-wrap:wrap}
.toolbar .search-wrap{flex:1;min-width:200px;max-width:320px;margin:0}
.filter-select{padding:8px 14px;border-radius:6px;border:1px solid var(--border);font-size:13px;background:var(--surface)}
.btn{padding:8px 16px;border-radius:6px;font-size:13px;border:none;cursor:pointer;text-decoration:none;display:inline-flex;align-items:center;gap:6px}
.btn-primary{background:var(--accent);color:#fff}
.btn-excel{background:#fff;border:1px solid var(--green);color:var(--green)}

.table-wrap{background:var(--surface);border:1px solid var(--border);border-radius:14px;overflow:hidden;box-shadow:var(--shadow-sm)}
.bid-table{width:100%;border-collapse:collapse;font-size:13px}
.bid-table thead{background:var(--surface2)}
.bid-table th,.bid-table td{padding:10px 12px;border-bottom:1px solid var(--border);text-align:left}
.bid-table th{font-size:12px;color:var(--text-muted);font-weight:600}
.bid-table tbody tr:hover{background:var(--accent-light)}
.bid-table .title-cell a{color:var(--text);text-decoration:none}
.bid-table .title-cell a:hover{color:var(--accent)}
.bid-table .title-cell .summary-link{cursor:pointer}
.bid-table .title-cell .external-link{margin-left:8px;font-size:11px;color:var(--text-dim);text-decoration:none;border:1px solid var(--border);padding:2px 6px;border-radius:6px;background:#fff}
.bid-table .title-cell .external-link:hover{border-color:var(--accent);color:var(--accent);background:var(--accent-light)}
.company-mode-hint{background:#eff6ff;border:1px solid #bfdbfe;color:var(--accent);padding:10px 12px;border-radius:10px;font-size:13px;margin-bottom:12px;display:flex;align-items:center;justify-content:space-between;gap:10px}
.company-mode-hint strong{font-weight:800}
.bid-table .source-badge{display:inline-block;padding:3px 8px;border-radius:999px;font-size:11px;font-weight:500}
.source-nara{background:#eff6ff;color:var(--accent)}
.source-kstartup{background:#ecfdf5;color:var(--green)}
.source-smes24{background:#f5f3ff;color:#6d28d9}
.source-bizinfo{background:#fef3c7;color:#b45309}
.source-smtech{background:#fff7ed;color:var(--orange)}
.source-iitp{background:#fef2f2;color:var(--red)}
.source-local{background:#ecfeff;color:#0e7490}
.deadline{font-size:12px}
.deadline.urgent{color:var(--red);font-weight:600}
.deadline.soon{color:var(--orange)}
.deadline.normal{color:var(--text-muted)}
.kw-badge{display:inline-block;font-size:11px;padding:2px 6px;margin:1px;background:var(--surface2);border-radius:4px;color:var(--text-muted)}

.pagination{display:flex;justify-content:space-between;align-items:center;margin-top:24px;flex-wrap:wrap;gap:12px}
.page-buttons{display:flex;gap:6px}
.page-btn{width:36px;height:36px;border-radius:8px;border:1px solid var(--border);background:var(--surface);color:var(--text-muted);font-size:13px;cursor:pointer;display:flex;align-items:center;justify-content:center;text-decoration:none}
.page-btn:hover{border-color:var(--accent);color:var(--accent)}
.page-btn.active{background:var(--accent);border-color:var(--accent);color:#fff}

.empty-state{text-align:center;padding:80px 20px;color:var(--text-muted)}
.stats-bar{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}
.stat-card{background:#fff;border:1px solid var(--border);border-radius:14px;padding:16px 18px;box-shadow:var(--shadow-sm);transition:transform .15s,box-shadow .15s}
.stat-card:hover{transform:translateY(-1px);box-shadow:var(--shadow-md)}
.stat-label{font-size:11px;color:var(--text-muted);margin-bottom:8px;font-weight:600;letter-spacing:.02em}
.stat-value{font-size:26px;font-weight:700;line-height:1;letter-spacing:-.03em}
.stat-card.accent .stat-value{color:var(--accent)}
.stat-card.green .stat-value{color:var(--green)}
.stat-card.orange .stat-value{color:var(--orange)}
.stat-card.red .stat-value{color:var(--red)}

.list-panel{background:#fff;border:1px solid var(--border);border-radius:14px;overflow:hidden;box-shadow:var(--shadow-sm)}
.list-toolbar{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:14px 18px;border-bottom:1px solid var(--border);flex-wrap:wrap;background:#fff}
.list-toolbar-left{font-size:14px;color:var(--text);font-weight:500}
.list-toolbar-left .page-info{color:var(--text-muted);font-weight:400}
.list-toolbar-right{display:flex;align-items:center;gap:14px;flex-wrap:wrap}
.per-page-group{display:flex;align-items:center;gap:8px;font-size:13px;color:var(--text-muted)}
.per-page-btns{display:flex;gap:6px}
.per-page-btn{min-width:36px;height:34px;padding:0 10px;border-radius:8px;border:1px solid var(--border);background:#fff;color:var(--text-muted);font-size:13px;text-decoration:none;display:inline-flex;align-items:center;justify-content:center;transition:all .15s}
.per-page-btn:hover{border-color:var(--accent);color:var(--accent)}
.per-page-btn.active{border-color:var(--text);color:var(--text);font-weight:700;background:#fff;box-shadow:inset 0 0 0 1px var(--text)}
.list-sort{padding:7px 12px;border-radius:8px;border:1px solid var(--border);font-size:13px;background:#fff;color:var(--text)}
.btn-excel-list{display:inline-flex;align-items:center;gap:6px;padding:8px 14px;border-radius:8px;border:1px solid var(--border);background:#fff;color:var(--text);font-size:13px;cursor:pointer;text-decoration:none}
.btn-excel-list:hover{border-color:var(--green);color:var(--green)}
.bid-list{list-style:none}
.bid-item{display:flex;gap:14px;padding:18px 18px;border-bottom:1px solid #eef2f7;transition:background .12s}
.bid-item:last-child{border-bottom:none}
.bid-item:hover{background:#fafbfd}
.bid-item-check{padding-top:4px;flex-shrink:0}
.bid-item-body{flex:1;min-width:0}
.bid-item-meta{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:8px;font-size:13px;color:var(--text-muted)}
.bid-type-badge{display:inline-flex;align-items:center;padding:3px 8px;border-radius:4px;background:#2563eb;color:#fff;font-size:12px;font-weight:700;line-height:1.2;max-width:140px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.bid-org-path{color:var(--text-muted)}
.bid-org-path .sep{margin:0 6px;color:#cbd5e1}
.bid-item-head{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;margin-bottom:10px}
.bid-item-title{font-size:16px;font-weight:700;line-height:1.45;margin:0;flex:1;min-width:0;color:var(--text)}
.bid-item-title a{color:inherit;text-decoration:none}
.bid-item-title a:hover{color:var(--accent)}
.bid-item-btns{display:flex;align-items:center;gap:8px;flex-shrink:0;flex-wrap:wrap}
.btn-original{display:inline-flex;align-items:center;justify-content:center;gap:6px;min-height:46px;padding:12px 18px;border-radius:12px;font-size:14px;font-weight:600;color:var(--accent);background:#fff;border:1px solid #bfdbfe;text-decoration:none;white-space:nowrap;line-height:1.2;transition:all .15s;box-shadow:0 1px 2px rgba(37,99,235,.06)}
.btn-original:hover{background:var(--accent-light);border-color:var(--accent);box-shadow:0 4px 12px rgba(37,99,235,.12);transform:translateY(-1px)}
.btn-ai-summary{flex-shrink:0;display:inline-flex;align-items:center;justify-content:center;gap:8px;min-width:120px;min-height:46px;padding:12px 22px;border-radius:12px;font-size:15px;font-weight:700;background:linear-gradient(180deg,#ecfdf5 0%,#d1fae5 100%);color:#047857;border:1px solid #6ee7b7;cursor:pointer;transition:all .15s;white-space:nowrap;line-height:1.2;box-shadow:0 1px 2px rgba(5,150,105,.08)}
.btn-ai-summary:hover{background:linear-gradient(180deg,#d1fae5 0%,#a7f3d0 100%);border-color:#34d399;box-shadow:0 4px 14px rgba(5,150,105,.18);transform:translateY(-1px)}
.btn-ai-summary:disabled{opacity:.65;cursor:wait;transform:none}
.bid-item-actions{display:flex;align-items:center;gap:8px;margin-bottom:10px;flex-wrap:wrap}
.bid-item-dates{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;font-size:13px;color:var(--text-muted)}
.bid-date-col{display:flex;gap:6px;align-items:baseline;min-width:0}
.bid-date-label{color:var(--text-dim);white-space:nowrap}
.bid-date-value{color:var(--text);font-weight:500}
.bid-date-value.urgent{color:var(--red);font-weight:700}
.bid-date-value.soon{color:var(--orange);font-weight:600}
.badge-no-deadline{display:inline-block;font-size:11px;padding:2px 7px;background:#f1f5f9;border:1px solid #cbd5e1;border-radius:999px;color:var(--text-muted);font-weight:500}
.bid-kw-row{margin-top:10px;display:flex;flex-wrap:wrap;gap:6px}
.list-pagination{display:flex;align-items:center;justify-content:center;gap:6px;padding:16px;border-top:1px solid var(--border);background:#fff}

/* ── 회사 선택 바 (공고 목록 상단) ── */
.company-select-bar{background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:14px 16px;margin-bottom:20px;display:flex;align-items:center;gap:10px;flex-wrap:wrap;box-shadow:var(--shadow-sm)}
.company-select-title{font-size:12px;font-weight:700;color:var(--text-muted)}
.company-card-list{display:flex;gap:10px;flex-wrap:wrap}
.company-card{width:164px;max-width:42vw;border:1px solid var(--border);background:var(--surface);border-radius:14px;padding:10px 10px 9px;cursor:pointer;transition:all .15s;display:flex;flex-direction:column;gap:8px;position:relative}
.company-card:hover{border-color:var(--accent);box-shadow:0 6px 18px rgba(37,99,235,.10);transform:translateY(-1px)}
.company-card.active{border-color:var(--accent);box-shadow:0 0 0 3px rgba(37,99,235,.12)}
.company-card-top{display:flex;align-items:center;justify-content:space-between;gap:8px}
.company-badge{font-size:10px;font-weight:700;color:var(--accent);background:var(--accent-light);border:1px solid #bfdbfe;padding:2px 8px;border-radius:999px}
.company-logo{width:100%;height:54px;border-radius:10px;background:var(--surface2);border:1px solid var(--border);display:flex;align-items:center;justify-content:center;overflow:hidden}
.company-logo img{width:100%;height:100%;object-fit:contain;display:block;background:#fff}
.company-name{font-size:13px;font-weight:700;color:var(--text);line-height:1.2;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.company-sub{font-size:11px;color:var(--text-dim);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.company-card.active .company-name{color:var(--accent)}
.company-card.all .company-logo{background:linear-gradient(135deg,var(--accent),#3b82f6);border-color:transparent}
.company-card.all .company-logo span{color:#fff;font-weight:800;font-size:20px;letter-spacing:.5px}
.company-card.all .company-badge{color:#fff;background:rgba(255,255,255,.18);border-color:rgba(255,255,255,.25)}
.company-card.all.active{box-shadow:0 0 0 3px rgba(37,99,235,.20)}

@media(max-width:900px){
  .main-layout{flex-direction:column;padding:12px 12px 16px}
  .page-hero{padding:12px 12px 0}
  .hero-inner{padding:16px 14px}
  .hero-title{font-size:19px}
  .sidebar{width:100%;position:static}
  .card-grid{grid-template-columns:1fr}
  .stats-bar{grid-template-columns:repeat(2,1fr)}
  .header{padding:12px}
  .sync-meta{display:none}
  .bid-item-dates{grid-template-columns:1fr}
  .bid-item-head{flex-direction:column;align-items:stretch}
  .bid-item-btns{width:100%}
  .btn-original,.btn-ai-summary{flex:1;min-width:0}
  .btn-ai-summary{width:auto;min-height:48px;font-size:16px}
  .list-toolbar{align-items:flex-start;flex-direction:column}
}

/* ── 챗봇 ── */
.chat-fab{position:fixed;bottom:28px;right:28px;width:54px;height:54px;border-radius:50%;background:linear-gradient(135deg,#7c3aed,#2563eb);color:#fff;font-size:24px;border:none;cursor:pointer;box-shadow:0 4px 18px rgba(124,58,237,.4);display:flex;align-items:center;justify-content:center;z-index:200;transition:transform .2s,box-shadow .2s}
.chat-fab:hover{transform:scale(1.08);box-shadow:0 6px 24px rgba(124,58,237,.55)}
.chat-fab .chat-fab-badge{position:absolute;top:-4px;right:-4px;background:var(--red);color:#fff;font-size:10px;font-weight:700;border-radius:10px;padding:2px 5px;display:none}
.chat-panel{position:fixed;bottom:92px;right:28px;width:380px;max-height:580px;background:#fff;border-radius:18px;box-shadow:0 12px 48px rgba(0,0,0,.18);display:flex;flex-direction:column;z-index:200;overflow:hidden;transform:scale(.95) translateY(10px);opacity:0;pointer-events:none;transition:all .2s}
.chat-panel.open{transform:scale(1) translateY(0);opacity:1;pointer-events:all}
.chat-header{padding:16px 18px;background:linear-gradient(135deg,#7c3aed,#2563eb);color:#fff;display:flex;align-items:center;gap:10px;flex-shrink:0}
.chat-header-icon{width:32px;height:32px;background:rgba(255,255,255,.2);border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:16px}
.chat-header-title{font-weight:700;font-size:14px}
.chat-header-sub{font-size:11px;opacity:.8;margin-top:1px}
.chat-header-close{margin-left:auto;background:none;border:none;color:#fff;opacity:.8;cursor:pointer;font-size:18px;line-height:1;padding:4px}
.chat-header-close:hover{opacity:1}
.chat-messages{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:12px}
.chat-msg{display:flex;flex-direction:column;gap:4px;max-width:88%}
.chat-msg.user{align-self:flex-end;align-items:flex-end}
.chat-msg.bot{align-self:flex-start;align-items:flex-start}
.chat-bubble{padding:10px 14px;border-radius:14px;font-size:13px;line-height:1.55;word-break:break-word}
.chat-msg.user .chat-bubble{background:linear-gradient(135deg,#7c3aed,#2563eb);color:#fff;border-bottom-right-radius:4px}
.chat-msg.bot .chat-bubble{background:var(--surface2);color:var(--text);border-bottom-left-radius:4px}
.chat-bid-list{display:flex;flex-direction:column;gap:6px;margin-top:4px}
.chat-bid-card{background:#fff;border:1px solid var(--border);border-radius:10px;padding:10px 12px;font-size:12px}
.chat-bid-card a{font-weight:600;color:var(--accent);text-decoration:none;display:block;margin-bottom:3px;line-height:1.4}
.chat-bid-card a:hover{text-decoration:underline}
.chat-bid-meta{color:var(--text-muted);font-size:11px;display:flex;gap:8px;flex-wrap:wrap}
.chat-bid-source{background:#eff6ff;color:var(--accent);border-radius:4px;padding:1px 6px;font-size:10px;font-weight:600}
.chat-bid-deadline{color:var(--red)}
.chat-typing{display:flex;gap:5px;align-items:center;padding:10px 14px;background:var(--surface2);border-radius:14px;border-bottom-left-radius:4px;width:fit-content}
.chat-typing span{width:7px;height:7px;border-radius:50%;background:var(--text-muted);animation:chatBounce .9s infinite}
.chat-typing span:nth-child(2){animation-delay:.15s}
.chat-typing span:nth-child(3){animation-delay:.3s}
@keyframes chatBounce{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-6px)}}
.chat-input-wrap{padding:12px 14px;border-top:1px solid var(--border);display:flex;gap:8px;flex-shrink:0;background:#fff}
.chat-input{flex:1;padding:10px 13px;border:1.5px solid var(--border);border-radius:10px;font-size:13px;outline:none;resize:none;max-height:100px;font-family:inherit;line-height:1.4;transition:border-color .2s}
.chat-input:focus{border-color:var(--accent)}
.chat-send{width:38px;height:38px;border-radius:10px;background:linear-gradient(135deg,#7c3aed,#2563eb);color:#fff;border:none;cursor:pointer;font-size:16px;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:opacity .2s;align-self:flex-end}
.chat-send:hover{opacity:.88}
.chat-send:disabled{opacity:.4;cursor:not-allowed}
.chat-empty{text-align:center;padding:28px 16px;color:var(--text-muted);font-size:13px}
.chat-empty-icon{font-size:32px;margin-bottom:10px}
.chat-suggestion{display:flex;flex-wrap:wrap;gap:6px;margin-top:4px}
.chat-suggestion button{padding:5px 10px;border-radius:20px;border:1px solid var(--border);background:var(--surface);font-size:11px;color:var(--text-muted);cursor:pointer;transition:all .15s}
.chat-suggestion button:hover{border-color:var(--accent);color:var(--accent)}
@media(max-width:480px){.chat-panel{right:12px;left:12px;width:auto;bottom:80px}}

/* ── AI 기능 ── */
.btn-ai{display:inline-block;margin-left:6px;padding:2px 7px;font-size:11px;border-radius:4px;background:#f0fdf4;color:#059669;border:1px solid #bbf7d0;cursor:pointer;vertical-align:middle;white-space:nowrap;transition:all .15s}
.btn-ai:hover{background:#dcfce7;border-color:#86efac}
.btn-ai.btn-ai-summary{display:inline-flex;margin-left:0;min-width:120px;min-height:46px;padding:12px 22px;border-radius:12px;font-size:15px;font-weight:700;background:linear-gradient(180deg,#ecfdf5 0%,#d1fae5 100%);color:#047857;border:1px solid #6ee7b7;box-shadow:0 1px 2px rgba(5,150,105,.08);vertical-align:initial}
.btn-ai.btn-ai-summary:hover{background:linear-gradient(180deg,#d1fae5 0%,#a7f3d0 100%);border-color:#34d399;box-shadow:0 4px 14px rgba(5,150,105,.18);transform:translateY(-1px)}
/* 이메일 알림 UI 제거됨 */

/* ── AI 추천 뷰 ── */
.view-toggle{display:flex;gap:8px;margin-bottom:16px}
.view-btn{padding:8px 16px;border-radius:999px;font-size:13px;font-weight:600;border:1px solid var(--border);background:var(--surface);color:var(--text-muted);cursor:pointer;display:flex;align-items:center;gap:6px;transition:all .15s;box-shadow:var(--shadow-sm)}
.view-btn:hover{border-color:var(--accent);color:var(--accent)}
.view-btn.active{background:var(--accent);border-color:var(--accent);color:#fff;box-shadow:0 4px 12px rgba(37,99,235,.22)}

.ai-panel{display:none}
.ai-panel.visible{display:block}

.company-tabs{display:flex;gap:8px;margin-bottom:20px;flex-wrap:wrap}
.company-tab{padding:8px 16px;border-radius:8px;font-size:13px;font-weight:500;border:2px solid var(--border);background:var(--surface);color:var(--text-muted);cursor:pointer;transition:all .15s}
.company-tab:hover{border-color:var(--accent);color:var(--accent)}
.company-tab.active{border-color:var(--accent);background:var(--accent-light);color:var(--accent)}

.ai-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:20px}
.ai-stat{background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:14px;text-align:center}
.ai-stat-num{font-size:22px;font-weight:700;margin-bottom:2px}
.ai-stat-label{font-size:11px;color:var(--text-muted)}
.ai-stat.high .ai-stat-num{color:#059669}
.ai-stat.mid .ai-stat-num{color:#d97706}
.ai-stat.low .ai-stat-num{color:var(--text-dim)}
.ai-stat.total .ai-stat-num{color:var(--accent)}

.ai-action-bar{display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;flex-wrap:wrap;gap:8px}
.ai-action-bar select{padding:7px 12px;border-radius:6px;border:1px solid var(--border);font-size:13px;background:var(--surface)}
.btn-run-ai{padding:8px 18px;border-radius:8px;font-size:13px;font-weight:600;background:linear-gradient(135deg,#7c3aed,#2563eb);color:#fff;border:none;cursor:pointer;display:flex;align-items:center;gap:6px;transition:opacity .2s}
.btn-run-ai:hover{opacity:.9}
.btn-run-ai:disabled{opacity:.5;cursor:not-allowed}
.ai-last-updated{font-size:11px;color:var(--text-dim)}

.bid-score-card{background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:16px;margin-bottom:12px;transition:box-shadow .15s;position:relative}
.bid-score-card:hover{box-shadow:0 4px 16px rgba(0,0,0,.08)}
.bid-score-card-top{display:flex;align-items:flex-start;gap:14px}
.score-badge{width:52px;height:52px;border-radius:12px;display:flex;flex-direction:column;align-items:center;justify-content:center;flex-shrink:0;font-weight:700;font-size:18px;color:#fff}
.score-badge .score-label{font-size:9px;font-weight:500;opacity:.85;margin-top:1px}
.score-high{background:linear-gradient(135deg,#059669,#10b981)}
.score-mid{background:linear-gradient(135deg,#d97706,#f59e0b)}
.score-low{background:linear-gradient(135deg,#94a3b8,#64748b)}
.bid-score-info{flex:1;min-width:0}
.bid-score-title{font-size:14px;font-weight:600;margin-bottom:4px;line-height:1.4}
.bid-score-title a{color:var(--text);text-decoration:none}
.bid-score-title a:hover{color:var(--accent)}
.bid-score-meta{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:8px}
.bid-category{display:inline-block;padding:3px 10px;border-radius:999px;font-size:11px;font-weight:600;background:#eff6ff;color:var(--accent);border:1px solid #bfdbfe}
.bid-score-reasoning{margin-top:10px;padding:10px 12px;background:var(--surface2);border-radius:8px;border-left:3px solid var(--accent)}
.reasoning-title{font-size:11px;font-weight:700;color:var(--accent);margin-bottom:6px;display:flex;align-items:center;gap:4px}
.reasoning-list{list-style:none;padding:0;margin:0}
.reasoning-list li{font-size:12px;color:var(--text);line-height:1.6;padding-left:14px;position:relative}
.reasoning-list li::before{content:"✓";position:absolute;left:0;color:var(--green);font-size:11px}
.bid-risks{margin-top:8px;padding:8px 10px;background:#fff7ed;border-radius:6px;border-left:3px solid #f59e0b;font-size:12px;color:#92400e}
.risks-label{font-weight:600;margin-right:4px}
.ai-empty{text-align:center;padding:60px 20px;color:var(--text-muted)}
.ai-empty-icon{font-size:48px;margin-bottom:12px}
.ai-loading{text-align:center;padding:40px 20px;color:var(--text-muted);font-size:14px}
.ai-loading-spinner{display:inline-block;width:24px;height:24px;border:3px solid var(--border);border-top-color:var(--accent);border-radius:50%;animation:spin .8s linear infinite;margin-bottom:8px}
@keyframes spin{to{transform:rotate(360deg)}}
.min-score-bar{display:flex;align-items:center;gap:8px;font-size:13px;color:var(--text-muted)}
.min-score-bar input[type=range]{width:120px;accent-color:var(--accent)}
.company-profile-hint{background:var(--accent-light);border:1px solid #bfdbfe;border-radius:10px;padding:12px 16px;margin-bottom:16px;font-size:12px;color:var(--accent)}
.profile-hint-title{font-weight:700;margin-bottom:6px;font-size:13px}
.profile-hint-list{list-style:none;padding:0;display:flex;flex-wrap:wrap;gap:6px}
.profile-hint-list li{background:#fff;border:1px solid #bfdbfe;border-radius:6px;padding:3px 10px}

/* ── 온보딩 모달 ── */
.onboard-overlay{display:none;position:fixed;inset:0;background:rgba(15,23,42,.6);z-index:300;align-items:center;justify-content:center;backdrop-filter:blur(4px)}
.onboard-overlay.open{display:flex}
.onboard-modal{background:#fff;border-radius:20px;padding:36px 32px;width:100%;max-width:480px;box-shadow:0 24px 64px rgba(0,0,0,.2);position:relative}
.onboard-logo{width:48px;height:48px;background:linear-gradient(135deg,#7c3aed,#2563eb);border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:22px;margin-bottom:20px}
.onboard-title{font-size:20px;font-weight:700;color:var(--text);margin-bottom:8px}
.onboard-sub{font-size:14px;color:var(--text-muted);margin-bottom:24px;line-height:1.6}
.onboard-steps{display:flex;gap:8px;margin-bottom:24px}
.onboard-step{flex:1;text-align:center;font-size:11px;color:var(--text-dim)}
.onboard-step-num{width:28px;height:28px;border-radius:50%;background:var(--surface2);border:2px solid var(--border);display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;margin:0 auto 4px;color:var(--text-muted)}
.onboard-step.done .onboard-step-num{background:var(--accent);border-color:var(--accent);color:#fff}
.onboard-step.active .onboard-step-num{background:#eff6ff;border-color:var(--accent);color:var(--accent)}
.onboard-url-wrap{display:flex;gap:8px;margin-bottom:12px}
.onboard-url-input{flex:1;padding:12px 14px;border:2px solid var(--border);border-radius:10px;font-size:14px;outline:none;transition:border-color .2s}
.onboard-url-input:focus{border-color:var(--accent)}
.onboard-url-input.error{border-color:var(--red)}
.btn-onboard{padding:12px 20px;border-radius:10px;background:linear-gradient(135deg,#7c3aed,#2563eb);color:#fff;border:none;font-size:14px;font-weight:600;cursor:pointer;white-space:nowrap;transition:opacity .2s}
.btn-onboard:hover{opacity:.9}
.btn-onboard:disabled{opacity:.5;cursor:not-allowed}
.onboard-hint{font-size:12px;color:var(--text-dim);margin-bottom:20px}
.onboard-analyzing{text-align:center;padding:20px 0}
.onboard-analyze-spinner{width:40px;height:40px;border:4px solid #e0e7ff;border-top-color:#7c3aed;border-radius:50%;animation:spin .8s linear infinite;margin:0 auto 14px}
.onboard-analyze-steps{font-size:13px;color:var(--text-muted);line-height:2}
.onboard-result{background:var(--surface2);border-radius:12px;padding:16px;margin-bottom:20px}
.onboard-result-name{font-size:18px;font-weight:700;margin-bottom:6px}
.onboard-result-summary{font-size:13px;color:var(--text-muted);margin-bottom:12px}
.onboard-result-tags{display:flex;flex-wrap:wrap;gap:6px}
.onboard-result-tag{padding:4px 10px;border-radius:6px;font-size:12px;background:#eff6ff;color:var(--accent);border:1px solid #bfdbfe}
.onboard-result-tag.strength{background:#f0fdf4;color:#059669;border-color:#bbf7d0}
.btn-confirm{width:100%;padding:13px;border-radius:10px;background:linear-gradient(135deg,#059669,#10b981);color:#fff;border:none;font-size:15px;font-weight:700;cursor:pointer;margin-bottom:8px;transition:opacity .2s}
.btn-confirm:hover{opacity:.9}
.btn-retry{width:100%;padding:10px;border-radius:10px;background:#fff;border:1px solid var(--border);color:var(--text-muted);font-size:13px;cursor:pointer}
.onboard-skip{text-align:center;margin-top:12px;font-size:12px;color:var(--text-dim)}
.onboard-skip a{color:var(--accent);cursor:pointer;text-decoration:underline}

.modal-overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:200;align-items:center;justify-content:center}
.modal-overlay.open{display:flex}
.modal{background:#fff;border-radius:14px;padding:28px;width:100%;max-width:480px;box-shadow:0 8px 32px rgba(0,0,0,.18);position:relative;max-height:80vh;overflow-y:auto}
.modal-title{font-size:16px;font-weight:700;margin-bottom:16px}
.modal-close{position:absolute;top:16px;right:18px;font-size:20px;cursor:pointer;color:var(--text-dim);background:none;border:none;line-height:1}
.summary-line{padding:10px 12px;border-radius:8px;background:var(--surface2);margin-bottom:8px;font-size:13px;line-height:1.6}
.summary-label{font-weight:600;color:var(--accent)}
.summary-loading{text-align:center;padding:24px;color:var(--text-muted);font-size:13px}

.recommend-panel{background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:16px;margin-top:16px;box-shadow:0 1px 3px rgba(0,0,0,.05)}
.recommend-title{font-size:12px;font-weight:700;color:var(--text-muted);margin-bottom:10px;display:flex;align-items:center;gap:6px}
.recommend-item{padding:8px 10px;border-radius:8px;border:1px solid var(--border);margin-bottom:6px;font-size:12px}
.recommend-item:last-child{margin-bottom:0}
.recommend-item a{color:var(--text);text-decoration:none;font-weight:500;display:block;margin-bottom:2px}
.recommend-item a:hover{color:var(--accent)}
.recommend-item .meta{color:var(--text-dim);font-size:11px}
.recommend-empty{font-size:12px;color:var(--text-dim);text-align:center;padding:12px}

/* 이메일 알림 UI 제거됨 */
</style>
</head>
<body>

<header class="site-header site-header--service">
  <div class="site-header__row">
    <a class="brand" href="https://portal.platformers.kr/">
      <img class="brand__logo" src="https://portal.platformers.kr/assets/eduallab-logo.png" alt="에듀올랩" />
      <span class="brand__sub">공고 매칭</span>
    </a>
    <div class="site-header__spacer"></div>
    <div class="site-header__actions">
      <span class="topbar__user" id="portalHeaderUser" hidden></span>
      <a class="topbar__btn" href="https://portal.platformers.kr/">워크포탈</a>
      <button class="topbar__btn" type="button" id="portalHeaderLogout" hidden>로그아웃</button>
    </div>
  </div>
</header>
<script src="https://portal.platformers.kr/assets/portal-header.js?v=1" defer></script>

<section class="page-hero">
  <div class="hero-inner">
    <div class="stats-bar">
      <div class="stat-card accent">
        <div class="stat-label">오늘 수집</div>
        <div class="stat-value"><?= number_format((int)$stats['today_total']) ?></div>
      </div>
      <div class="stat-card green">
        <div class="stat-label">키워드 매칭</div>
        <div class="stat-value"><?= number_format((int)$stats['keyword_match']) ?></div>
      </div>
      <div class="stat-card orange">
        <div class="stat-label">마감 3일 이내</div>
        <div class="stat-value"><?= number_format((int)$stats['urgent']) ?></div>
      </div>
      <div class="stat-card red">
        <div class="stat-label">신규</div>
        <div class="stat-value"><?= number_format((int)$stats['new_today']) ?></div>
      </div>
    </div>
  </div>
</section>

<div class="main-layout">
  <!-- 좌측 필터 패널 -->
  <aside class="sidebar">
    <div class="filter-panel">
      <form method="GET" action="index.php" id="filterForm">
        <input type="hidden" name="source" value="<?= htmlspecialchars($filters['source']) ?>">
        <input type="hidden" name="deadline" value="<?= htmlspecialchars($filters['deadline']) ?>">
        <input type="hidden" name="sort" value="<?= htmlspecialchars($filters['sort']) ?>">
        <input type="hidden" name="tags" id="tagsInput" value="<?= htmlspecialchars(implode(',', $filters['tags'])) ?>">
        <?php if ($companyOnly && $companyId > 0): ?>
          <input type="hidden" name="company_only" value="1">
          <input type="hidden" name="company_id" value="<?= (int)$companyId ?>">
          <input type="hidden" name="eligible_only" value="<?= $eligibleOnly ? '1' : '0' ?>">
          <input type="hidden" name="min_score" value="<?= (int)$minScore ?>">
        <?php endif; ?>

        <div class="filter-title">공고명 · 기관명 검색</div>
        <div class="search-wrap" style="margin-bottom:20px">
          <span class="search-icon">🔍</span>
          <input type="text" name="search" class="search-input" id="searchInput" value="<?= htmlspecialchars($filters['search']) ?>" placeholder="검색어 입력..." autocomplete="off">
          <div class="suggest-list" id="suggestList" style="display:none"></div>
        </div>

        <?php
          $selectedSources = $filters['sources'];
          if (!$selectedSources && $filters['source'] !== '') {
            $selectedSources = [$filters['source']];
          }
        ?>
        <div class="filter-group">
          <div class="filter-label">사이트명</div>
          <div class="multi-select" id="sourceMulti">
            <button type="button" class="multi-select-toggle" id="sourceToggle">
              <span>
                <?php if (empty($selectedSources)): ?>
                  전체 사이트
                <?php else: ?>
                  <?= htmlspecialchars(implode(', ', $selectedSources)) ?>
                <?php endif; ?>
              </span>
              <span style="font-size:11px;color:var(--text-dim)">▼</span>
            </button>
            <div class="multi-select-menu" id="sourceMenu">
              <label class="multi-select-item">
                <span>
                  <input type="checkbox" value="__all" <?= empty($selectedSources) ? 'checked' : '' ?>> 전체
                </span>
                <span class="count"><?= (int)($source_counts['전체'] ?? 0) ?></span>
              </label>
              <?php foreach ($source_counts as $name => $cnt): if ($name === '전체') continue; ?>
              <label class="multi-select-item">
                <span>
                  <input type="checkbox" class="source-option" value="<?= htmlspecialchars($name) ?>" <?= in_array($name, $selectedSources, true) ? 'checked' : '' ?>>
                  <?= htmlspecialchars($name) ?>
                </span>
                <span class="count"><?= (int)$cnt ?></span>
              </label>
              <?php endforeach; ?>
            </div>
          </div>
          <input type="hidden" name="sources" id="sourcesInput" value="<?= htmlspecialchars(implode(',', $selectedSources)) ?>">
        </div>

        <div class="filter-group">
          <div class="filter-label">마감일</div>
          <div class="filter-options">
            <a href="?<?= http_build_query(array_merge($_GET, ['deadline'=>'','page'=>1])) ?>" class="filter-link <?= $filters['deadline']===''?'active':'' ?>">전체</a>
            <a href="?<?= http_build_query(array_merge($_GET, ['deadline'=>'3','page'=>1])) ?>" class="filter-link <?= $filters['deadline']==='3'?'active':'' ?>">3일 이내</a>
            <a href="?<?= http_build_query(array_merge($_GET, ['deadline'=>'7','page'=>1])) ?>" class="filter-link <?= $filters['deadline']==='7'?'active':'' ?>">7일 이내</a>
            <a href="?<?= http_build_query(array_merge($_GET, ['deadline'=>'30','page'=>1])) ?>" class="filter-link <?= $filters['deadline']==='30'?'active':'' ?>">1개월 이내</a>
          </div>
        </div>

        <div class="filter-group">
          <div class="filter-label">태그 검색</div>
          <div class="multi-select" id="tagMulti">
            <button type="button" class="multi-select-toggle" id="tagToggle">
              <span>
                <?php if (empty($filters['tags'])): ?>
                  전체
                <?php else:
                  $selectedNames = array_map(function ($id) use ($keywords) {
                    foreach ($keywords as $k) { if ((int)$k['id'] === (int)$id) return $k['keyword']; }
                    return '';
                  }, $filters['tags']);
                  $selectedNames = array_filter($selectedNames);
                  ?>
                  <?= htmlspecialchars(implode(', ', $selectedNames)) ?>
                <?php endif; ?>
              </span>
              <span style="font-size:11px;color:var(--text-dim)">▼</span>
            </button>
            <div class="multi-select-menu" id="tagMenu">
              <?php
              $tagCountMap = [];
              foreach ($tag_counts['keywords'] ?? [] as $kw) {
                $tagCountMap[(int)$kw['id']] = (int)$kw['cnt'];
              }
              ?>
              <label class="multi-select-item">
                <span>
                  <input type="checkbox" value="__all" id="tagAll" <?= empty($filters['tags']) ? 'checked' : '' ?>> 전체
                </span>
                <span class="count"><?= (int)($tag_counts['total'] ?? 0) ?></span>
              </label>
              <?php foreach ($keywords as $kw):
                $kid = (int)$kw['id'];
                $cnt = $tagCountMap[$kid] ?? 0;
                $name = $kw['keyword'];
              ?>
              <label class="multi-select-item">
                <span>
                  <input type="checkbox" class="tag-option" value="<?= $kid ?>" data-keyword="<?= htmlspecialchars($name) ?>" <?= in_array($kid, $filters['tags'], true) ? 'checked' : '' ?>>
                  <?= htmlspecialchars($name) ?>
                </span>
                <span class="count"><?= $cnt ?></span>
              </label>
              <?php endforeach; ?>
            </div>
          </div>
          <p style="font-size:11px;color:var(--text-dim);margin-top:6px">여러 태그 선택 시 해당 키워드 중 하나라도 포함된 공고가 표시됩니다.</p>
        </div>

        <button type="submit" class="btn-filter">필터 적용</button>
      </form>

      <div class="filter-group" style="margin-top:20px">
        <div class="filter-label">키워드 관리</div>
        <form method="POST" action="keyword_add.php" style="display:flex;gap:6px;margin-bottom:8px">
          <input type="text" name="keyword" placeholder="키워드 입력 후 + 클릭" style="flex:1;padding:6px 10px;border:1px solid var(--border);border-radius:6px;font-size:13px" required>
          <button type="submit" class="btn btn-primary" style="padding:6px 12px">+</button>
        </form>
        <?php foreach ($keywords as $kw): ?>
        <div style="display:inline-flex;align-items:center;gap:4px;margin:2px">
          <span style="font-size:12px"><?= htmlspecialchars($kw['keyword']) ?></span>
          <a href="keyword_delete.php?id=<?= $kw['id'] ?>" onclick="return confirm('삭제?')" style="color:var(--text-dim);font-size:14px">×</a>
        </div>
        <?php endforeach; ?>
      </div>
    </div>
  </aside>

    <!-- AI 추천 공고 패널 -->
    <div class="recommend-panel" id="recommendPanel" style="display:none">
      <div class="recommend-title">⭐ AI 맞춤 추천 공고</div>
      <div id="recommendList"><div class="recommend-empty">북마크를 추가하면 추천 공고를 불러옵니다.</div></div>
    </div>
  </aside>

  <!-- 우측 콘텐츠 -->
  <main class="content">

    <!-- 뷰 전환 토글 -->
    <div class="view-toggle" style="display:none">
      <button class="view-btn active" id="viewBtnList">📋 공고 목록</button>
    </div>

    <!-- ══ 기본 목록 뷰 ══ -->
    <div id="listView">
    <!-- 회사 선택 (통계 아래) -->
    <div class="company-select-bar">
      <div class="company-select-title">회사 선택</div>
      <div id="listCompanyPills" class="company-card-list"></div>
      <div style="margin-left:auto;display:flex;gap:10px;align-items:center;flex-wrap:wrap">
        <label style="display:flex;align-items:center;gap:8px;font-size:13px;color:var(--text-muted)">
          <input type="checkbox" id="listEligibleOnly" <?= $eligibleOnly ? 'checked' : '' ?> style="accent-color:var(--accent)">
          신청 자격 성립만
        </label>
        <label style="display:flex;align-items:center;gap:8px;font-size:13px;color:var(--text-muted)">
          <span>최소 점수</span>
          <select id="listMinScore" style="padding:7px 10px;border-radius:8px;border:1px solid var(--border);background:var(--surface);font-size:13px">
            <?php foreach ([0,20,40,60,80] as $ms): ?>
              <option value="<?= $ms ?>" <?= $minScore===$ms?'selected':'' ?>><?= $ms ?>+</option>
            <?php endforeach; ?>
          </select>
        </label>
      </div>
    </div>

    <form method="GET" action="index.php" id="listForm">
      <input type="hidden" name="search" value="<?= htmlspecialchars($filters['search']) ?>">
      <input type="hidden" name="source" value="<?= htmlspecialchars($filters['source']) ?>">
      <input type="hidden" name="deadline" value="<?= htmlspecialchars($filters['deadline']) ?>">
      <input type="hidden" name="tags" value="<?= htmlspecialchars(implode(',', $filters['tags'])) ?>">
      <input type="hidden" name="sources" value="<?= htmlspecialchars(implode(',', $filters['sources'])) ?>">
      <input type="hidden" name="from" value="<?= htmlspecialchars($filters['from']) ?>">
      <input type="hidden" name="to" value="<?= htmlspecialchars($filters['to']) ?>">
      <input type="hidden" name="page" value="<?= (int)$page ?>">
      <input type="hidden" name="per_page" id="perPageInput" value="<?= (int)$per_page ?>">
      <?php if ($companyOnly && $companyId > 0): ?>
        <input type="hidden" name="company_only" value="1">
        <input type="hidden" name="company_id" value="<?= (int)$companyId ?>">
        <input type="hidden" name="eligible_only" value="<?= $eligibleOnly ? '1' : '0' ?>">
        <input type="hidden" name="min_score" value="<?= (int)$minScore ?>">
      <?php endif; ?>

    <div class="list-panel">
      <?php if ($companyOnly && $companyId > 0): ?>
        <?php
        $companyName = ($company ?? null) ? ($company['name'] ?? '') : '';
        $companySortLabels = [
          'score' => '점수 높은순',
          'scored' => '채점 최신순',
          'newest' => '수집 최신순',
          'deadline' => '마감일순',
          'amount' => '예산(금액)순',
        ];
        $sortLabel = $companySortLabels[$filters['sort']] ?? '점수 높은순';
        ?>
        <div class="company-mode-hint" style="margin:0;border-radius:0;border-left:none;border-right:none;border-top:none">
          <div>현재 <strong><?= htmlspecialchars($companyName ?: '선택된 회사') ?></strong> 기준 <strong>AI 맞춤 공고</strong> 목록입니다. <span style="color:var(--text-muted);font-weight:500">(정렬: <?= htmlspecialchars($sortLabel) ?>)</span></div>
          <a href="index.php" style="font-size:12px;color:var(--accent);text-decoration:underline">전체 공고로 돌아가기</a>
        </div>
      <?php else: ?>
        <div class="company-mode-hint" style="margin:0;border-radius:0;border-left:none;border-right:none;border-top:none;background:var(--surface2);border-style:dashed">
          <div style="font-size:13px;color:var(--text-muted)"><strong>전체 수집 공고</strong>입니다. <strong>회사 선택</strong>에서 회사 카드를 누르면 <strong>AI 맞춤 공고</strong> 목록으로 전환됩니다.</div>
        </div>
      <?php endif; ?>

      <div class="list-toolbar">
        <div class="list-toolbar-left">
          총 <?= number_format((int)$total) ?>건
          <?php if ($total_pages > 0): ?>
            <span class="page-info">[ <?= (int)$page ?> / <?= max(1, (int)$total_pages) ?> 페이지 ]</span>
          <?php endif; ?>
        </div>
        <div class="list-toolbar-right">
          <label style="display:flex;align-items:center;gap:6px;font-size:13px;color:var(--text-muted)"><input type="checkbox" id="checkAll"> 전체 선택</label>
          <div class="per-page-group">
            <span>목록 표시 개수</span>
            <div class="per-page-btns">
              <?php foreach ([10, 20, 30, 50] as $pp): ?>
                <a href="?<?= http_build_query(array_merge($_GET, ['per_page' => $pp, 'page' => 1])) ?>" class="per-page-btn <?= (int)$per_page === $pp ? 'active' : '' ?>"><?= $pp ?></a>
              <?php endforeach; ?>
            </div>
          </div>
          <select name="sort" class="list-sort" onchange="this.form.submit()">
            <?php if ($companyOnly && $companyId > 0): ?>
            <option value="score" <?= $filters['sort']==='score'?'selected':'' ?>>점수 높은순</option>
            <option value="scored" <?= $filters['sort']==='scored'?'selected':'' ?>>채점 최신순</option>
            <option value="newest" <?= $filters['sort']==='newest'?'selected':'' ?>>수집 최신순</option>
            <option value="deadline" <?= $filters['sort']==='deadline'?'selected':'' ?>>마감일순</option>
            <option value="amount" <?= $filters['sort']==='amount'?'selected':'' ?>>예산(금액)순</option>
            <?php else: ?>
            <option value="newest" <?= $filters['sort']==='newest'?'selected':'' ?>>최신순</option>
            <option value="deadline" <?= $filters['sort']==='deadline'?'selected':'' ?>>마감일순</option>
            <option value="amount" <?= $filters['sort']==='amount'?'selected':'' ?>>금액순</option>
            <?php endif; ?>
          </select>
          <button type="button" class="btn-excel-list" id="btnExport">📊 엑셀다운로드</button>
        </div>
      </div>

      <?php if (empty($bids) && $total > 0): ?>
        <div class="empty-state">
          <div style="font-size:48px;margin-bottom:16px">📭</div>
          <div>현재 페이지에 표시할 공고가 없습니다.</div>
          <a href="?<?= http_build_query(array_merge($_GET, ['page' => 1])) ?>" style="display:inline-block;margin-top:12px;color:var(--accent);font-size:13px">1페이지로 이동</a>
        </div>
      <?php elseif (empty($bids)): ?>
        <div class="empty-state">
          <div style="font-size:48px;margin-bottom:16px">📭</div>
          <div>검색 결과가 없습니다.</div>
        </div>
      <?php else: ?>
      <ul class="bid-list">
        <?php foreach ($bids as $i => $bid):
          $linkUrl = $bid['url'] ?? '';
          $linkUrl = html_entity_decode((string)$linkUrl, ENT_QUOTES | ENT_HTML5, 'UTF-8');
          if (($bid['source'] ?? '') === '기업마당' && $linkUrl !== '' && strpos($linkUrl, 'http') !== 0) {
            $linkUrl = 'https://www.bizinfo.go.kr' . (strpos($linkUrl, '/') === 0 ? $linkUrl : '/' . $linkUrl);
          }
          if (($bid['source'] ?? '') === '영등포구청' && $linkUrl !== '') {
            $linkUrl = preg_replace('#^https?://www\.ydp\.go\.kr/selectBbsNttView\.do#', 'https://www.ydp.go.kr/www/selectBbsNttView.do', $linkUrl);
          }
          $noticeDate = !empty($bid['notice_date']) ? $bid['notice_date'] : '-';
          $deadlineStatus = $bid['deadline_status'] ?? 'unknown';
          $displayDeadline = displayDeadlineForBid($bid);
          if ($displayDeadline !== null) {
              $deadlineDate = $displayDeadline;
              $deadline_class = getDeadlineClass($displayDeadline);
          } elseif ($deadlineStatus === 'none') {
              $deadlineDate = '<span class="badge-no-deadline">마감일 없음</span>';
              $deadline_class = 'normal';
          } else {
              $deadlineDate = '-';
              $deadline_class = 'normal';
          }
          $fetchedDate = !empty($bid['fetched_at']) ? date('Y-m-d', strtotime((string)$bid['fetched_at'])) : '-';
        ?>
        <li class="bid-item">
          <div class="bid-item-check"><input type="checkbox" class="row-check" value="<?= $bid['id'] ?>" aria-label="선택"></div>
          <div class="bid-item-body">
            <div class="bid-item-meta">
              <span class="bid-type-badge"><?= htmlspecialchars($bid['source']) ?></span>
              <?php if (!empty($bid['org_name'])): ?>
              <span class="bid-org-path"><span><?= htmlspecialchars($bid['org_name']) ?></span></span>
              <?php endif; ?>
            </div>
            <div class="bid-item-head">
              <h3 class="bid-item-title">
                <a href="#" class="summary-link js-summary" data-bid-id="<?= (int)$bid['id'] ?>" data-bid-title="<?= htmlspecialchars($bid['title']) ?>" title="요약 보기"><?= htmlspecialchars($bid['title']) ?></a>
              </h3>
              <div class="bid-item-btns">
                <?php if ($linkUrl): ?>
                <a class="btn-original" href="<?= htmlspecialchars($linkUrl) ?>" target="_blank" rel="noopener" title="원문 열기">↗ 원문 보기</a>
                <?php endif; ?>
                <button class="btn-ai btn-ai-summary" type="button" data-bid-id="<?= $bid['id'] ?>" data-bid-title="<?= htmlspecialchars($bid['title']) ?>">✨ AI 요약</button>
              </div>
            </div>
            <div class="bid-item-dates">
              <div class="bid-date-col"><span class="bid-date-label">공고일자</span><span class="sep">|</span><span class="bid-date-value"><?= htmlspecialchars($noticeDate) ?></span></div>
              <div class="bid-date-col"><span class="bid-date-label">마감일</span><span class="sep">|</span><span class="bid-date-value <?= $deadline_class ?>"><?= $deadlineStatus === 'none' ? $deadlineDate : htmlspecialchars($deadlineDate) ?></span></div>
              <div class="bid-date-col"><span class="bid-date-label">수집일</span><span class="sep">|</span><span class="bid-date-value"><?= htmlspecialchars($fetchedDate) ?></span></div>
            </div>
            <?php if (!empty($bid['matched_keywords'])): ?>
            <div class="bid-kw-row">
              <?php foreach (explode(',', $bid['matched_keywords']) as $kw): ?>
                <?php if (trim($kw)): ?><span class="kw-badge"><?= htmlspecialchars(trim($kw)) ?></span><?php endif; ?>
              <?php endforeach; ?>
            </div>
            <?php endif; ?>
          </div>
        </li>
        <?php endforeach; ?>
      </ul>
      <?php endif; ?>

      <?php if ($total_pages > 1): ?>
      <div class="list-pagination">
        <?php if ($page > 1): ?><a href="?<?= http_build_query(array_merge($_GET,['page'=>$page-1])) ?>" class="page-btn">‹</a><?php endif; ?>
        <?php for ($p = max(1,$page-2); $p <= min($total_pages,$page+2); $p++): ?>
        <a href="?<?= http_build_query(array_merge($_GET,['page'=>$p])) ?>" class="page-btn <?= $p===$page?'active':'' ?>"><?= $p ?></a>
        <?php endfor; ?>
        <?php if ($page < $total_pages): ?><a href="?<?= http_build_query(array_merge($_GET,['page'=>$page+1])) ?>" class="page-btn">›</a><?php endif; ?>
      </div>
      <?php endif; ?>
    </div>
    </form>

    </div><!-- /listView -->

    <!-- ══ AI 추천 뷰 ══ -->
    <div id="aiView" class="ai-panel">

      <!-- 회사 탭 -->
      <div id="companyTabsWrap">
        <div class="company-tabs" id="companyTabs" style="align-items:center">
          <span style="font-size:13px;color:var(--text-muted)">회사 정보를 불러오는 중...</span>
        </div>
        <button onclick="openOnboard()" style="margin-top:8px;padding:6px 14px;border-radius:8px;border:1px dashed var(--border);background:var(--surface);font-size:12px;color:var(--text-muted);cursor:pointer;display:flex;align-items:center;gap:5px;transition:all .15s" onmouseover="this.style.borderColor='var(--accent)';this.style.color='var(--accent)'" onmouseout="this.style.borderColor='var(--border)';this.style.color='var(--text-muted)'">
          + 새 회사 URL로 추가
        </button>
      </div>

      <!-- 회사 프로필 힌트 -->
      <div class="company-profile-hint" id="companyProfileHint" style="display:none">
        <div class="profile-hint-title" id="profileHintTitle"></div>
        <ul class="profile-hint-list" id="profileHintList"></ul>
      </div>

      <!-- AI 점수 통계 -->
      <div class="ai-stats" id="aiStats" style="display:none">
        <div class="ai-stat total"><div class="ai-stat-num" id="statTotal">-</div><div class="ai-stat-label">AI 분석 완료</div></div>
        <div class="ai-stat high"><div class="ai-stat-num" id="statHigh">-</div><div class="ai-stat-label">강력 추천 (80+)</div></div>
        <div class="ai-stat mid"><div class="ai-stat-num" id="statMid">-</div><div class="ai-stat-label">검토 추천 (60-79)</div></div>
        <div class="ai-stat low"><div class="ai-stat-num" id="statLow">-</div><div class="ai-stat-label">낮은 우선순위</div></div>
      </div>

      <!-- 액션 바 -->
      <div class="ai-action-bar">
        <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap">
      <label style="display:flex;align-items:center;gap:8px;font-size:13px;color:var(--text-muted);background:var(--surface);border:1px solid var(--border);padding:6px 10px;border-radius:10px">
        <input type="checkbox" id="eligibleOnlyToggle" checked style="accent-color:var(--accent)">
        신청 자격 성립만 보기
      </label>
          <div class="min-score-bar">
            <span>최소 점수</span>
            <input type="range" id="minScoreRange" min="0" max="90" step="10" value="40">
            <span id="minScoreLabel" style="font-weight:600;color:var(--accent)">40점</span>
          </div>
          <span class="ai-last-updated" id="aiLastUpdated"></span>
        </div>
        <button class="btn-run-ai" id="btnRunScore">
          ✨ AI 분석 실행
        </button>
      </div>

      <!-- 공고 카드 목록 -->
      <div id="aiCardList">
        <div class="ai-loading">
          <div class="ai-loading-spinner"></div>
          <div>AI 추천 공고를 불러오는 중...</div>
        </div>
      </div>

      <!-- 더보기 -->
      <div id="aiPagination" style="text-align:center;margin-top:16px;display:none">
        <button class="btn btn-primary" id="btnLoadMore" style="padding:10px 28px">더 보기</button>
      </div>

    </div><!-- /aiView -->

  </main>
</div>

<!-- ══ 온보딩 모달: 회사 URL 입력 ══ -->
<div class="onboard-overlay" id="onboardOverlay">
  <div class="onboard-modal">

    <!-- Step 1: URL 입력 -->
    <div id="onboardStep1">
      <div class="onboard-logo">🤖</div>
      <div class="onboard-title">우리 회사 맞춤 공고 추천</div>
      <div class="onboard-sub">회사 홈페이지 주소만 입력하면<br>AI가 자동으로 분석해서 딱 맞는 지원사업을 찾아드립니다.</div>

      <div class="onboard-steps">
        <div class="onboard-step active">
          <div class="onboard-step-num">1</div>
          URL 입력
        </div>
        <div class="onboard-step" id="stepDot2">
          <div class="onboard-step-num">2</div>
          AI 분석
        </div>
        <div class="onboard-step" id="stepDot3">
          <div class="onboard-step-num">3</div>
          추천 시작
        </div>
      </div>

      <div class="onboard-url-wrap">
        <input type="url" class="onboard-url-input" id="onboardUrlInput"
          placeholder="https://your-company.com" autocomplete="off">
        <button class="btn-onboard" id="btnAnalyze">분석하기</button>
      </div>
      <div class="onboard-hint">예) https://platformers.kr &nbsp;·&nbsp; 홈페이지가 없으면 아래에서 건너뛰기</div>
      <div id="onboardError" style="display:none;color:var(--red);font-size:13px;margin-bottom:8px"></div>
    </div>

    <!-- Step 2: 분석 중 -->
    <div id="onboardStep2" style="display:none">
      <div class="onboard-analyzing">
        <div class="onboard-analyze-spinner"></div>
        <div style="font-weight:600;font-size:15px;margin-bottom:8px">AI가 홈페이지를 분석하고 있어요</div>
        <div class="onboard-analyze-steps" id="analyzeStepText">
          🔍 홈페이지 접속 중...
        </div>
      </div>
    </div>

    <!-- Step 3: 결과 확인 -->
    <div id="onboardStep3" style="display:none">
      <div style="font-size:15px;font-weight:700;margin-bottom:14px">✅ 분석 완료! 맞나요?</div>
      <div class="onboard-result">
        <div class="onboard-result-name" id="resultName"></div>
        <div class="onboard-result-summary" id="resultSummary"></div>
        <div class="onboard-result-tags" id="resultTags"></div>
      </div>
      <button class="btn-confirm" id="btnConfirm">이 회사로 추천 시작 →</button>
      <button class="btn-retry" id="btnRetry">다시 입력하기</button>
    </div>

    <div class="onboard-skip">
      <a id="onboardSkip">건너뛰고 전체 목록 보기</a>
      &nbsp;·&nbsp;
      <a id="onboardChange">내 회사 변경</a>
    </div>
  </div>
</div>

<!-- AI 요약 모달 -->
<div class="modal-overlay" id="summaryModal">
  <div class="modal">
    <button class="modal-close" id="summaryClose">×</button>
    <div class="modal-title" id="summaryTitle">AI 공고 요약</div>
    <div id="summaryContent"><div class="summary-loading">⏳ AI가 요약 중입니다...</div></div>
  </div>
</div>

<!-- 이메일 알림 모달 제거됨 -->

<script>
(function(){
  const STORAGE_KEY = 'bid_monitor_bookmarks';
  function getBookmarks(){try{return JSON.parse(localStorage.getItem(STORAGE_KEY)||'[]')}catch(e){return []}}
  function setBookmarks(arr){localStorage.setItem(STORAGE_KEY,JSON.stringify(arr))}
  function isBookmarked(id){return getBookmarks().includes(id)}

  const searchInput = document.getElementById('searchInput');
  const suggestList = document.getElementById('suggestList');
  const searchIcon  = document.querySelector('.search-icon');
  const sourceToggle = document.getElementById('sourceToggle');
  const sourceMenu   = document.getElementById('sourceMenu');
  const sourcesInput = document.getElementById('sourcesInput');
  let suggestTimer;

  function fetchSuggest(q){
    fetch('api_suggest.php?q='+encodeURIComponent(q))
      .then(r=>r.json())
      .then(data=>{
        if(!data.keywords||data.keywords.length===0){ suggestList.style.display='none'; return; }
        suggestList.innerHTML = data.keywords.map(k=>{
          const p = new URLSearchParams(window.location.search);
          p.set('search', searchInput.value.trim());
          let tags = (p.get('tags') || '').split(',').filter(Boolean);
          if (!tags.includes(String(k.id))) tags.push(String(k.id));
          p.set('tags', tags.join(','));
          p.delete('tag');
          p.set('page', '1');
          return '<a href="?'+p.toString()+'" class="suggest-item">'+escapeHtml(k.keyword)+'</a>';
        }).join('');
        suggestList.style.display='block';
      })
      .catch(()=>{ suggestList.style.display='none'; });
  }

  searchInput.addEventListener('input',function(){
    clearTimeout(suggestTimer);
    const q = this.value.trim();
    if(q.length<1){ suggestList.style.display='none'; return; }
    suggestTimer = setTimeout(()=>fetchSuggest(q), 200);
  });
  searchInput.addEventListener('focus',function(){
    if(this.value.trim().length>0) fetchSuggest(this.value.trim());
  });
  searchInput.addEventListener('blur',()=>setTimeout(()=>{ suggestList.style.display='none'; },150));

  function escapeHtml(s){const d=document.createElement('div');d.textContent=s;return d.innerHTML}

  // 돋보기 아이콘 클릭 시 검색 실행
  if (searchIcon) {
    searchIcon.addEventListener('click', () => {
      const form = document.getElementById('filterForm');
      if (form) {
        form.submit();
      }
    });
  }

  // 사이트명 멀티 선택 드롭다운
  if (sourceToggle && sourceMenu && sourcesInput) {
    const allCheckbox = sourceMenu.querySelector('input[value="__all"]');
    const optionCheckboxes = Array.from(sourceMenu.querySelectorAll('.source-option'));

    function updateHiddenInput() {
      const selected = optionCheckboxes.filter(ch => ch.checked).map(ch => ch.value);
      if (allCheckbox) {
        allCheckbox.checked = selected.length === 0;
      }
      sourcesInput.value = selected.join(',');
      const labelSpan = sourceToggle.querySelector('span');
      if (labelSpan) {
        labelSpan.textContent = selected.length === 0 ? '전체 사이트' : selected.join(', ');
      }
    }

    sourceToggle.addEventListener('click', () => {
      const isOpen = sourceMenu.style.display === 'block';
      sourceMenu.style.display = isOpen ? 'none' : 'block';
    });

    if (allCheckbox) {
      allCheckbox.addEventListener('change', () => {
        if (allCheckbox.checked) {
          optionCheckboxes.forEach(ch => { ch.checked = false; });
        }
        updateHiddenInput();
      });
    }

    optionCheckboxes.forEach(ch => {
      ch.addEventListener('change', () => {
        if (allCheckbox && ch.checked) {
          allCheckbox.checked = false;
        }
        updateHiddenInput();
      });
    });

    document.addEventListener('click', (e) => {
      if (!sourceMenu.contains(e.target) && !sourceToggle.contains(e.target)) {
        sourceMenu.style.display = 'none';
      }
    });
  }

  // 태그 멀티 선택 드롭다운 (사이트명과 동일 패턴)
  const tagToggle = document.getElementById('tagToggle');
  const tagMenu = document.getElementById('tagMenu');
  const tagsInput = document.getElementById('tagsInput');
  if (tagToggle && tagMenu && tagsInput) {
    const tagAllCheckbox = document.getElementById('tagAll');
    const tagOptionCheckboxes = Array.from(document.querySelectorAll('.tag-option'));

    function updateTagHidden() {
      const selected = tagOptionCheckboxes.filter(ch => ch.checked).map(ch => ch.value);
      if (tagAllCheckbox) {
        tagAllCheckbox.checked = selected.length === 0;
      }
      tagsInput.value = selected.join(',');
      const labelSpan = tagToggle.querySelector('span');
      if (labelSpan) {
        if (selected.length === 0) {
          labelSpan.textContent = '전체';
        } else {
          labelSpan.textContent = selected.map(id => {
            const opt = tagOptionCheckboxes.find(ch => ch.value === id);
            return opt ? (opt.getAttribute('data-keyword') || id) : id;
          }).join(', ');
        }
      }
    }

    tagToggle.addEventListener('click', (e) => {
      e.preventDefault();
      const isOpen = tagMenu.style.display === 'block';
      tagMenu.style.display = isOpen ? 'none' : 'block';
    });

    if (tagAllCheckbox) {
      tagAllCheckbox.addEventListener('change', () => {
        if (tagAllCheckbox.checked) {
          tagOptionCheckboxes.forEach(ch => { ch.checked = false; });
        }
        updateTagHidden();
      });
    }

    tagOptionCheckboxes.forEach(ch => {
      ch.addEventListener('change', () => {
        if (tagAllCheckbox && ch.checked) {
          tagAllCheckbox.checked = false;
        }
        updateTagHidden();
      });
    });

    document.addEventListener('click', (e) => {
      if (!tagMenu.contains(e.target) && !tagToggle.contains(e.target)) {
        tagMenu.style.display = 'none';
      }
    });
  }

  // 체크박스 전체 선택
  const checkAll = document.getElementById('checkAll');
  const rowChecks = document.querySelectorAll('.row-check');
  if (checkAll && rowChecks.length) {
    checkAll.addEventListener('change', () => {
      rowChecks.forEach(ch => { ch.checked = checkAll.checked; });
    });
    rowChecks.forEach(ch => {
      ch.addEventListener('change', () => {
        if (!ch.checked) checkAll.checked = false;
      });
    });
  }

  // 엑셀 다운로드: 체크한 행만 / 안 했으면 필터된 목록 전체
  const btnExport = document.getElementById('btnExport');
  if (btnExport) {
    btnExport.addEventListener('click', () => {
      const checked = Array.from(document.querySelectorAll('.row-check:checked')).map(ch => ch.value);
      const url = new URL(window.location.href);
      url.searchParams.set('export', '1');
      if (checked.length) {
        url.searchParams.set('ids', checked.join(','));
      } else {
        url.searchParams.delete('ids');
      }
      window.location.href = url.toString();
    });
  }

  // ── AI 요약 ──
  const summaryModal = document.getElementById('summaryModal');
  const summaryTitle = document.getElementById('summaryTitle');
  const summaryContent = document.getElementById('summaryContent');
  const summaryInFlight = new Map(); // bidId -> Promise

  function closeSummaryModal() { summaryModal.classList.remove('open'); }
  document.getElementById('summaryClose').addEventListener('click', closeSummaryModal);
  summaryModal.addEventListener('click', e => { if (e.target === summaryModal) closeSummaryModal(); });

  function renderSummary(text) {
    const lines = text.split('\n').filter(l => l.trim());
    const html = lines.map(line => {
      const m = line.match(/^(핵심내용|신청자격|지원규모):\s*(.+)/);
      if (m) return `<div class="summary-line"><span class="summary-label">${m[1]}</span>: ${escapeHtml(m[2])}</div>`;
      return `<div class="summary-line">${escapeHtml(line)}</div>`;
    }).join('');
    return html || `<div class="summary-line">${escapeHtml(text)}</div>`;
  }

  document.querySelectorAll('.btn-ai').forEach(btn => {
    btn.addEventListener('click', async () => {
      const bidId = btn.dataset.bidId;
      const bidTitle = btn.dataset.bidTitle;
      summaryTitle.textContent = bidTitle;
      summaryContent.innerHTML = '<div class="summary-loading">⏳ AI가 요약 중입니다...</div>';
      summaryModal.classList.add('open');
      if (summaryInFlight.has(bidId)) return;
      btn.disabled = true;
      try {
        const p = fetch(`api_summary.php?id=${bidId}`).then(r => r.json());
        summaryInFlight.set(bidId, p);
        const data = await p;
        if (data.error) {
          summaryContent.innerHTML = `<div class="summary-line" style="color:var(--red)">${escapeHtml(data.error)}</div>`;
        } else {
          summaryContent.innerHTML = renderSummary(data.summary);
        }
      } catch {
        summaryContent.innerHTML = '<div class="summary-line" style="color:var(--red)">요약을 불러오는 중 오류가 발생했습니다.</div>';
      } finally {
        summaryInFlight.delete(bidId);
        btn.disabled = false;
      }
    });
  });

  // 제목 클릭 시에도 요약 모달 열기 (원문 링크는 별도 버튼)
  document.querySelectorAll('.js-summary').forEach(link => {
    link.addEventListener('click', async (e) => {
      e.preventDefault();
      const bidId = link.dataset.bidId;
      const bidTitle = link.dataset.bidTitle;
      summaryTitle.textContent = bidTitle || 'AI 공고 요약';
      summaryContent.innerHTML = '<div class="summary-loading">⏳ AI가 요약 중입니다...</div>';
      summaryModal.classList.add('open');
      if (summaryInFlight.has(bidId)) return;
      try {
        const p = fetch(`api_summary.php?id=${bidId}`).then(r => r.json());
        summaryInFlight.set(bidId, p);
        const data = await p;
        if (data.error) {
          summaryContent.innerHTML = `<div class="summary-line" style="color:var(--red)">${escapeHtml(data.error)}</div>`;
        } else {
          summaryContent.innerHTML = renderSummary(data.summary);
        }
      } catch {
        summaryContent.innerHTML = '<div class="summary-line" style="color:var(--red)">요약을 불러오는 중 오류가 발생했습니다.</div>';
      } finally {
        summaryInFlight.delete(bidId);
      }
    });
  });

  // ── 맞춤 추천 ──
  const recommendPanel = document.getElementById('recommendPanel');
  const recommendList  = document.getElementById('recommendList');
  let recommendInFlight = null;

  async function loadRecommendations() {
    if (recommendInFlight) return recommendInFlight;
    const ids = getBookmarks();
    if (!ids.length) return;
    recommendPanel.style.display = 'block';
    recommendList.innerHTML = '<div class="recommend-empty">추천 공고를 불러오는 중...</div>';
    recommendInFlight = (async () => {
      try {
        const res = await fetch('api_recommend.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ids }),
        });
        const data = await res.json();
        if (!data.bids || !data.bids.length) {
          recommendList.innerHTML = '<div class="recommend-empty">관련 추천 공고가 없습니다.</div>';
          return;
        }
        recommendList.innerHTML = data.bids.map(b => {
          const deadline = b.deadline_date ? `마감 ${b.deadline_date}` : '';
          return `<div class="recommend-item">
            <a href="${escapeHtml(b.url || '#')}" target="_blank">${escapeHtml(b.title || '')}</a>
            <div class="meta">${escapeHtml(b.org_name || '')} ${deadline ? '· ' + deadline : ''}</div>
          </div>`;
        }).join('');
      } catch {
        recommendList.innerHTML = '<div class="recommend-empty">추천을 불러오지 못했습니다.</div>';
      } finally {
        recommendInFlight = null;
      }
    })();
    return recommendInFlight;
  }

  loadRecommendations();

  // ══════════════════════════════════════
  // ── 공고 목록: 회사 선택 필터 ──
  // ══════════════════════════════════════
  const listCompanyPills = document.getElementById('listCompanyPills');
  const listEligibleOnly = document.getElementById('listEligibleOnly');
  const listMinScore = document.getElementById('listMinScore');

  function getParam(name) {
    try { return new URL(window.location.href).searchParams.get(name); } catch { return null; }
  }
  function setParamsAndGo(params) {
    const url = new URL(window.location.href);
    Object.entries(params).forEach(([k, v]) => {
      if (v === null || v === undefined || v === '') url.searchParams.delete(k);
      else url.searchParams.set(k, String(v));
    });
    url.searchParams.set('page', '1');
    window.location.href = url.toString();
  }

  async function loadListCompanies() {
    if (!listCompanyPills) return;
    try {
      const res = await fetch('api_company_scores.php?action=companies');
      const data = await res.json();
      const companiesRaw = data.companies || [];
      // 요청: 어크로스페이스는 UI에서 숨김
      const companies = companiesRaw.filter(c => {
        const name = String(c.name || '');
        const slug = String(c.slug || '');
        return name !== '어크로스페이스' && slug !== 'acrosspace';
      });

      const activeCompanyId = parseInt(getParam('company_id') || '0') || 0;
      const isCompanyOnly = (getParam('company_only') || '') === '1';

      const logoMap = {
        platformers: 'assets/company/platformers.png',
        '플랫포머즈': 'assets/company/platformers.png',
        eduallab: 'assets/company/eduallab.png',
        '에듀올랩': 'assets/company/eduallab.png',
      };

      const pills = [];
      // 전체 탭
      pills.push(`
        <button type="button" class="company-card all ${!isCompanyOnly ? 'active' : ''}" data-company="0">
          <div class="company-card-top">
            <span class="company-badge">ALL</span>
            <span style="font-size:11px;color:var(--text-dim)">목록</span>
          </div>
          <div class="company-logo"><span>전체</span></div>
          <div>
            <div class="company-name">전체 공고</div>
            <div class="company-sub">필터 없이 전체 보기</div>
          </div>
        </button>
      `.trim());
      companies.forEach(c => {
        const active = isCompanyOnly && activeCompanyId === parseInt(c.id);
        const label = escapeHtml(c.name || '');
        const slug = String(c.slug || '');
        const img = logoMap[slug] || '';
        const sub = escapeHtml((c.business_summary || '').trim());
        pills.push(`
          <button type="button" class="company-card ${active ? 'active' : ''}" data-company="${c.id}">
            <div class="company-card-top">
              <span class="company-badge">회사</span>
              <span style="font-size:11px;color:var(--text-dim)">선택</span>
            </div>
            <div class="company-logo">
              ${img ? `<img src="${escapeHtml(img)}" alt="${label} 로고">` : `<span style="font-weight:800;color:var(--text-dim);font-size:18px">${label.slice(0,1)}</span>`}
            </div>
            <div>
              <div class="company-name">${label}</div>
              <div class="company-sub">${sub || '맞춤 공고 보기'}</div>
            </div>
          </button>
        `.trim());
      });
      listCompanyPills.innerHTML = pills.join('');

      listCompanyPills.querySelectorAll('.company-card').forEach(btn => {
        btn.addEventListener('click', () => {
          const cid = parseInt(btn.dataset.company || '0') || 0;
          if (!cid) {
            setParamsAndGo({ company_only: null, company_id: null, sort: null });
            return;
          }
          const eligibleOnly = listEligibleOnly ? (listEligibleOnly.checked ? '1' : '0') : (getParam('eligible_only') || '1');
          const minScore = listMinScore ? listMinScore.value : (getParam('min_score') || '40');
          setParamsAndGo({
            company_only: '1',
            company_id: cid,
            eligible_only: eligibleOnly,
            min_score: minScore,
            sort: 'score',
          });
        });
      });
    } catch {
      // 무시: 회사 API 실패 시 pills 비워둠
    }
  }

  if (listEligibleOnly) {
    listEligibleOnly.addEventListener('change', () => {
      const isCompanyOnly = (getParam('company_only') || '') === '1';
      const cid = getParam('company_id') || '';
      if (!isCompanyOnly || !cid) return;
      setParamsAndGo({ eligible_only: listEligibleOnly.checked ? '1' : '0' });
    });
  }
  if (listMinScore) {
    listMinScore.addEventListener('change', () => {
      const isCompanyOnly = (getParam('company_only') || '') === '1';
      const cid = getParam('company_id') || '';
      if (!isCompanyOnly || !cid) return;
      setParamsAndGo({ min_score: listMinScore.value });
    });
  }

  loadListCompanies();

  // ══════════════════════════════════════
  // ── 온보딩: 회사 URL 입력 & 분석 ──
  // ══════════════════════════════════════

  const COMPANY_KEY  = 'bid_monitor_company'; // localStorage key
  const onboardOverlay = document.getElementById('onboardOverlay');
  const onboardUrlInput = document.getElementById('onboardUrlInput');
  const btnAnalyze   = document.getElementById('btnAnalyze');
  const onboardError = document.getElementById('onboardError');

  // 저장된 회사 불러오기
  function getSavedCompany() {
    try { return JSON.parse(localStorage.getItem(COMPANY_KEY) || 'null'); } catch { return null; }
  }
  function saveCompany(data) {
    localStorage.setItem(COMPANY_KEY, JSON.stringify(data));
  }
  function clearCompany() {
    localStorage.removeItem(COMPANY_KEY);
  }

  // 첫 방문 시 또는 변경 요청 시 온보딩 표시
  function checkOnboarding() {
    // 공고 목록 화면에서는 AI 추천 뷰 진입 버튼이 없으므로 온보딩을 띄우지 않음
    const hasAiEntry = !!document.getElementById('viewBtnAi') || !!document.getElementById('btnAiView');
    if (!hasAiEntry) return;
    const saved = getSavedCompany();
    if (!saved) {
      openOnboard();
    }
  }

  function openOnboard() {
    showStep(1);
    onboardOverlay.classList.add('open');
  }
  window.openOnboard = openOnboard;

  function closeOnboard() {
    onboardOverlay.classList.remove('open');
  }
  window.closeOnboard = closeOnboard;

  function showStep(n) {
    document.getElementById('onboardStep1').style.display = n === 1 ? '' : 'none';
    document.getElementById('onboardStep2').style.display = n === 2 ? '' : 'none';
    document.getElementById('onboardStep3').style.display = n === 3 ? '' : 'none';
    ['stepDot2','stepDot3'].forEach((id, i) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.className = 'onboard-step' + (n > i+1 ? ' done' : n === i+2 ? ' active' : '');
    });
    onboardError.style.display = 'none';
  }

  let analyzedProfile = null;
  let analyzedCompany = null;

  async function runAnalysis() {
    const url = onboardUrlInput.value.trim();
    if (!url) { showError('홈페이지 주소를 입력해주세요.'); return; }

    showStep(2);
    const stepText = document.getElementById('analyzeStepText');

    const steps = [
      '🔍 홈페이지 접속 중...',
      '📄 페이지 내용 읽는 중...',
      '🤖 AI가 회사를 분석하고 있습니다...',
      '✨ 맞춤 추천 기준 생성 중...',
    ];
    let si = 0;
    const timer = setInterval(() => {
      si = (si + 1) % steps.length;
      stepText.textContent = steps[si];
    }, 1800);

    try {
      const res  = await fetch('api_analyze_company.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      clearInterval(timer);

      if (data.error) { showStep(1); showError(data.error); return; }

      analyzedCompany = data.company;
      analyzedProfile = data.profile;
      renderResult(data.profile);
      showStep(3);
    } catch (e) {
      clearInterval(timer);
      showStep(1);
      showError('분석 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  }

  function renderResult(p) {
    document.getElementById('resultName').textContent    = p.name || '';
    document.getElementById('resultSummary').textContent = p.business_summary || '';
    const tags = document.getElementById('resultTags');
    const items = [
      ...(p.sectors || []).slice(0, 3).map(s => `<span class="onboard-result-tag">${escapeHtml(s)}</span>`),
      ...(p.strengths || []).slice(0, 2).map(s => `<span class="onboard-result-tag strength">✓ ${escapeHtml(s)}</span>`),
      ...(p.preferred_categories || []).slice(0, 2).map(s => `<span class="onboard-result-tag">${escapeHtml(s)}</span>`),
    ];
    tags.innerHTML = items.join('');
  }

  function showError(msg) {
    onboardError.textContent = msg;
    onboardError.style.display = 'block';
  }

  btnAnalyze && btnAnalyze.addEventListener('click', runAnalysis);
  onboardUrlInput && onboardUrlInput.addEventListener('keydown', e => { if (e.key === 'Enter') runAnalysis(); });

  document.getElementById('btnConfirm') && document.getElementById('btnConfirm').addEventListener('click', () => {
    if (!analyzedCompany) return;
    saveCompany(analyzedCompany);
    closeOnboard();
    // AI 추천 탭으로 자동 이동
    switchToAiView();
  });

  document.getElementById('btnRetry') && document.getElementById('btnRetry').addEventListener('click', () => showStep(1));
  document.getElementById('onboardSkip') && document.getElementById('onboardSkip').addEventListener('click', closeOnboard);
  document.getElementById('onboardChange') && document.getElementById('onboardChange').addEventListener('click', () => {
    clearCompany();
    openOnboard();
  });

  // 페이지 로드 시 온보딩 체크
  checkOnboarding();

  // ══════════════════════════════════════
  // ── AI 추천 뷰 ──
  // ══════════════════════════════════════

  const viewBtnList  = document.getElementById('viewBtnList');
  const viewBtnAi    = document.getElementById('viewBtnAi');
  const listView     = document.getElementById('listView');
  const aiView       = document.getElementById('aiView');
  const btnAiView    = document.getElementById('btnAiView');

  let aiCurrentCompanyId = null;
  let aiCurrentPage = 1;
  let aiMinScore = 40;
  let aiEligibleOnly = true;
  let companiesData = [];
  let aiLoaded = false;

  function switchToAiView() {
    listView.style.display = 'none';
    aiView.classList.add('visible');
    viewBtnList.classList.remove('active');
    viewBtnAi.classList.add('active');
    if (!aiLoaded) {
      aiLoaded = true;
      loadCompanies();
    }
  }

  function switchToListView() {
    listView.style.display = '';
    aiView.classList.remove('visible');
    viewBtnAi.classList.remove('active');
    viewBtnList.classList.add('active');
  }

  viewBtnList && viewBtnList.addEventListener('click', switchToListView);
  viewBtnAi && viewBtnAi.addEventListener('click', switchToAiView);
  if (btnAiView) btnAiView.addEventListener('click', switchToAiView);

  // 최소 점수 슬라이더
  const minScoreRange = document.getElementById('minScoreRange');
  const minScoreLabel = document.getElementById('minScoreLabel');
  if (minScoreRange) {
    minScoreRange.addEventListener('input', () => {
      aiMinScore = parseInt(minScoreRange.value);
      minScoreLabel.textContent = aiMinScore + '점';
    });
    minScoreRange.addEventListener('change', () => {
      aiCurrentPage = 1;
      if (aiCurrentCompanyId) loadScoredBids(aiCurrentCompanyId, 1);
    });
  }

  // 신청 자격 성립만 보기 토글
  const eligibleOnlyToggle = document.getElementById('eligibleOnlyToggle');
  if (eligibleOnlyToggle) {
    eligibleOnlyToggle.addEventListener('change', () => {
      aiEligibleOnly = !!eligibleOnlyToggle.checked;
      aiCurrentPage = 1;
      if (aiCurrentCompanyId) loadScoredBids(aiCurrentCompanyId, 1);
    });
  }

  // AI 분석 실행 버튼
  const btnRunScore = document.getElementById('btnRunScore');
  if (btnRunScore) {
    btnRunScore.addEventListener('click', async () => {
      if (!aiCurrentCompanyId) return;
      const company = companiesData.find(c => c.id === aiCurrentCompanyId);
      const name = company ? company.name : '';
      if (!confirm(`[${name}] 대상으로 AI 분석을 실행합니다.\n미채점 공고를 OpenAI로 분석하며 수십 초가 소요될 수 있습니다.`)) return;

      btnRunScore.disabled = true;
      btnRunScore.textContent = '⏳ AI 분석 중...';
      document.getElementById('aiCardList').innerHTML = `<div class="ai-loading"><div class="ai-loading-spinner"></div><div>AI가 공고를 분석하고 있습니다...<br><small style="color:var(--text-dim)">공고 수에 따라 30초~수 분이 소요됩니다.</small></div></div>`;

      try {
        const slug = company ? company.slug : '';
        const res = await fetch(`score_bids.php?manual=1&company=${encodeURIComponent(slug)}&all=1&limit=100`, { signal: AbortSignal.timeout(300000) });
        if (res.ok) {
          aiCurrentPage = 1;
          await loadScoredBids(aiCurrentCompanyId, 1);
        } else {
          document.getElementById('aiCardList').innerHTML = `<div class="ai-empty"><div class="ai-empty-icon">⚠️</div><div>AI 분석 실행 중 오류가 발생했습니다.</div></div>`;
        }
      } catch (e) {
        document.getElementById('aiCardList').innerHTML = `<div class="ai-empty"><div class="ai-empty-icon">⚠️</div><div>요청 시간이 초과됐습니다. 백그라운드에서 계속 실행 중일 수 있습니다.<br>잠시 후 새로고침해 주세요.</div></div>`;
      } finally {
        btnRunScore.disabled = false;
        btnRunScore.innerHTML = '✨ AI 분석 실행';
      }
    });
  }

  // 회사 목록 로드
  async function loadCompanies() {
    try {
      const res = await fetch('api_company_scores.php?action=companies');
      const data = await res.json();
      companiesData = data.companies || [];

      if (companiesData.length === 0) {
        // 등록된 회사 없으면 온보딩으로
        document.getElementById('aiCardList').innerHTML = `
          <div class="ai-empty">
            <div class="ai-empty-icon">🏢</div>
            <div style="font-weight:600;margin-bottom:8px">아직 등록된 회사가 없습니다</div>
            <div style="font-size:13px;color:var(--text-dim);margin-bottom:16px">홈페이지 주소를 입력하면 AI가 자동으로 분석해드립니다.</div>
            <button class="btn-run-ai" onclick="openOnboard()" style="margin:0 auto">🏢 우리 회사 등록하기</button>
          </div>`;
        return;
      }

      renderCompanyTabs(companiesData);

      // localStorage에 저장된 회사 우선 선택
      const saved = getSavedCompany();
      const target = saved
        ? companiesData.find(c => c.id === saved.id || c.slug === saved.slug)
        : null;
      selectCompany(target ? target.id : companiesData[0].id);
    } catch {
      document.getElementById('companyTabs').innerHTML = '<span style="color:var(--red);font-size:13px">회사 정보를 불러오지 못했습니다.</span>';
    }
  }

  function renderCompanyTabs(companies) {
    const tabs = document.getElementById('companyTabs');
    tabs.innerHTML = companies.map(c => `
      <button class="company-tab" data-id="${c.id}" data-slug="${escapeHtml(c.slug)}" style="display:flex;align-items:center;gap:6px;padding-right:8px">
        <span>🏢 ${escapeHtml(c.name)}</span>
        <span class="tab-del" data-id="${c.id}" title="삭제" style="font-size:14px;line-height:1;color:var(--text-dim);padding:0 2px;border-radius:4px" onmouseover="this.style.color='var(--red)'" onmouseout="this.style.color='var(--text-dim)'">×</span>
      </button>
    `).join('');
    tabs.querySelectorAll('.company-tab').forEach(btn => {
      btn.addEventListener('click', (e) => {
        if (e.target.classList.contains('tab-del')) return;
        selectCompany(parseInt(btn.dataset.id));
      });
    });
    tabs.querySelectorAll('.tab-del').forEach(x => {
      x.addEventListener('click', (e) => {
        e.stopPropagation();
        deleteCompany(parseInt(x.dataset.id));
      });
    });
  }

  async function deleteCompany(companyId) {
    const company = companiesData.find(c => c.id === companyId);
    const name = company ? company.name : '이 회사';
    if (!confirm(`"${name}"를 목록에서 삭제할까요?`)) return;
    const fd = new FormData();
    fd.append('company_id', companyId);
    await fetch('api_company_scores.php?action=delete', { method: 'POST', body: fd });
    companiesData = companiesData.filter(c => c.id !== companyId);
    if (aiCurrentCompanyId === companyId) {
      aiCurrentCompanyId = null;
      document.getElementById('aiCardList').innerHTML = '';
    }
    if (companiesData.length === 0) {
      document.getElementById('companyTabs').innerHTML = '';
      openOnboard();
    } else {
      renderCompanyTabs(companiesData);
      const next = aiCurrentCompanyId ? companiesData.find(c => c.id === aiCurrentCompanyId) : companiesData[0];
      selectCompany(next ? next.id : companiesData[0].id);
    }
  }

  function selectCompany(companyId) {
    aiCurrentCompanyId = companyId;
    aiCurrentPage = 1;

    document.querySelectorAll('.company-tab').forEach(btn => {
      btn.classList.toggle('active', parseInt(btn.dataset.id) === companyId);
    });

    const company = companiesData.find(c => c.id === companyId);
    if (company) saveCompany({ id: company.id, slug: company.slug, name: company.name });
    renderProfileHint(company);
    loadScoreStats(companyId);
    loadScoredBids(companyId, 1);
  }

  function renderProfileHint(company) {
    const hint = document.getElementById('companyProfileHint');
    const title = document.getElementById('profileHintTitle');
    const list = document.getElementById('profileHintList');
    if (!company) { hint.style.display = 'none'; return; }

    const items = [];
    if (company.ceo_status) items.push(company.ceo_status);
    if (company.sectors && company.sectors.length) items.push(...company.sectors.slice(0, 3));
    if (company.strengths && company.strengths.length) items.push(...company.strengths.slice(0, 2));

    title.textContent = `🏢 ${company.name} — AI 추천 기준`;
    list.innerHTML = items.map(s => `<li>${escapeHtml(s)}</li>`).join('');
    hint.style.display = items.length ? 'block' : 'none';
  }

  async function loadScoreStats(companyId) {
    const statsEl = document.getElementById('aiStats');
    try {
      const res = await fetch(`api_company_scores.php?action=stats&company_id=${companyId}`);
      const s = await res.json();
      document.getElementById('statTotal').textContent = s.total_scored ?? 0;
      document.getElementById('statHigh').textContent = s.high ?? 0;
      document.getElementById('statMid').textContent = s.mid ?? 0;
      document.getElementById('statLow').textContent = s.low ?? 0;
      const lastEl = document.getElementById('aiLastUpdated');
      if (s.last_scored_at) lastEl.textContent = `마지막 분석: ${s.last_scored_at}`;
      statsEl.style.display = 'grid';
    } catch {
      statsEl.style.display = 'none';
    }
  }

  async function loadScoredBids(companyId, page = 1) {
    const cardList = document.getElementById('aiCardList');
    const paginEl  = document.getElementById('aiPagination');

    if (page === 1) {
      cardList.innerHTML = `<div class="ai-loading"><div class="ai-loading-spinner"></div><div>AI 추천 공고를 불러오는 중...</div></div>`;
      paginEl.style.display = 'none';
    }

    try {
      const eligibleOnlyParam = aiEligibleOnly ? '1' : '0';
      const sortParam = encodeURIComponent(getParam('sort') || 'score');
      const url = `api_company_scores.php?company_id=${companyId}&page=${page}&min_score=${aiMinScore}&limit=10&eligible_only=${eligibleOnlyParam}&sort=${sortParam}`;
      const res  = await fetch(url);
      const data = await res.json();
      const bids = data.bids || [];

      if (page === 1) cardList.innerHTML = '';

      if (bids.length === 0 && page === 1) {
        cardList.innerHTML = `
          <div class="ai-empty">
            <div class="ai-empty-icon">🤖</div>
            <div style="font-weight:600;margin-bottom:8px">AI 추천 공고가 없습니다</div>
            <div style="font-size:13px;color:var(--text-dim)">"AI 분석 실행" 버튼을 눌러 공고를 분석하거나<br>최소 점수 기준을 낮춰보세요.</div>
          </div>`;
        paginEl.style.display = 'none';
        return;
      }

      bids.forEach(bid => {
        cardList.insertAdjacentHTML('beforeend', renderScoreCard(bid));
      });

      aiCurrentPage = page;
      paginEl.style.display = bids.length >= 10 ? 'block' : 'none';
    } catch {
      if (page === 1) cardList.innerHTML = `<div class="ai-empty"><div class="ai-empty-icon">⚠️</div><div>추천 공고를 불러오지 못했습니다.</div></div>`;
    }
  }

  const btnLoadMore = document.getElementById('btnLoadMore');
  if (btnLoadMore) {
    btnLoadMore.addEventListener('click', () => {
      if (aiCurrentCompanyId) loadScoredBids(aiCurrentCompanyId, aiCurrentPage + 1);
    });
  }

  function renderScoreCard(bid) {
    const score = parseInt(bid.score) || 0;
    const badgeClass = score >= 70 ? 'score-high' : score >= 40 ? 'score-mid' : 'score-low';
    const scoreLabel = score >= 80 ? '강력추천' : score >= 60 ? '추천' : score >= 40 ? '검토' : '낮음';

    const reasoning = Array.isArray(bid.reasoning) ? bid.reasoning : [];
    const reasoningHtml = reasoning.length
      ? `<div class="bid-score-reasoning">
           <div class="reasoning-title">🤖 AI 추천 근거</div>
           <ul class="reasoning-list">${reasoning.map(r => `<li>${escapeHtml(r)}</li>`).join('')}</ul>
         </div>`
      : '';

    const eligible = (bid.eligible === 1 || bid.eligible === true || bid.eligible === '1');
    const eligibilityReason = (bid.eligibility_reason || '').trim();
    const eligibilityHtml = eligibilityReason
      ? `<div class="bid-risks" style="background:#eef2ff;border-left-color:#6366f1;color:#3730a3">
           <span class="risks-label">✅ 신청자격 판단:</span>${escapeHtml(eligibilityReason)}
         </div>`
      : (eligible
          ? `<div class="bid-risks" style="background:#eef2ff;border-left-color:#6366f1;color:#3730a3">
               <span class="risks-label">✅ 신청자격 판단:</span>신청 자격이 성립하는 것으로 판단됩니다.
             </div>`
          : '');

    const risksHtml = bid.risks
      ? `<div class="bid-risks"><span class="risks-label">⚠ 체크포인트:</span>${escapeHtml(bid.risks)}</div>`
      : '';

    const deadlineStr = bid.deadline_date || '-';
    const sourceClass = getSourceClass(bid.source || '');
    const url = escapeHtml(bid.url || '#');

    return `
      <div class="bid-score-card">
        <div class="bid-score-card-top">
          <div class="score-badge ${badgeClass}">
            ${score}
            <span class="score-label">${scoreLabel}</span>
          </div>
          <div class="bid-score-info">
            <div class="bid-score-title">
              <a href="${url}" target="_blank">${escapeHtml(bid.title || '')}</a>
            </div>
            <div class="bid-score-meta">
              ${bid.category ? `<span class="bid-category">${escapeHtml(bid.category)}</span>` : ''}
              <span class="source-badge ${sourceClass}">${escapeHtml(bid.source || '')}</span>
              <span class="deadline ${getDeadlineClass(bid.deadline_date)}">마감 ${deadlineStr}</span>
              ${bid.org_name ? `<span style="font-size:12px;color:var(--text-muted)">${escapeHtml(bid.org_name)}</span>` : ''}
            </div>
          </div>
        </div>
        ${reasoningHtml}
        ${eligibilityHtml}
        ${risksHtml}
      </div>`;
  }

  function getSourceClass(source) {
    const map = {'나라장터':'source-nara','K-스타트업':'source-kstartup','중소벤처24':'source-smes24','기업마당':'source-bizinfo','중소기업기술정보진흥원':'source-smtech','IITP':'source-iitp','천안시 고시공고':'source-local','충청남도 도정공고':'source-local'};
    return map[source] || 'source-nara';
  }

  function getDeadlineClass(d) {
    if (!d) return 'normal';
    const diff = (new Date(d) - new Date()) / 86400000;
    if (diff <= 3) return 'urgent';
    if (diff <= 7) return 'soon';
    return 'normal';
  }

  // 이메일 알림 기능 제거됨
})();
</script>

<!-- chatbot removed — replaced by search.php -->
<div style="display:none" id="chatFab">
  💬
  <span class="chat-fab-badge" id="chatFabBadge">!</span>
</button>

<!-- ══ 챗봇 패널 ══ -->
<div class="chat-panel" id="chatPanel">
  <div class="chat-header">
    <div class="chat-header-icon">🤖</div>
    <div>
      <div class="chat-header-title">지원사업 AI 어시스턴트</div>
      <div class="chat-header-sub">상황을 말씀해 주시면 맞는 공고를 찾아드립니다</div>
    </div>
    <button class="chat-header-close" id="chatClose">×</button>
  </div>
  <div class="chat-messages" id="chatMessages">
    <div class="chat-empty">
      <div class="chat-empty-icon">👋</div>
      <div style="font-weight:600;margin-bottom:6px;color:var(--text)">안녕하세요!</div>
      <div>어떤 지원사업을 찾고 계신가요?<br>창업 단계, 업종, 지역을 알려주시면<br>딱 맞는 공고를 찾아드릴게요.</div>
      <div class="chat-suggestion" style="justify-content:center;margin-top:14px">
        <button onclick="chatSuggest('AI 스타트업인데 초기 창업 지원금 받고 싶어요')">AI 스타트업 창업지원</button>
        <button onclick="chatSuggest('예비창업자인데 지원받을 수 있는 공고 있나요?')">예비창업자 지원</button>
        <button onclick="chatSuggest('이번 달 마감인 지원사업 알려줘')">이번 달 마감 공고</button>
        <button onclick="chatSuggest('R&D 자금 지원 공고 찾아줘')">R&D 자금 지원</button>
      </div>
    </div>
  </div>
  <div class="chat-input-wrap">
    <textarea class="chat-input" id="chatInput" placeholder="예) AI 스타트업인데 개발비 지원받고 싶어요" rows="1"></textarea>
    <button class="chat-send" id="chatSend">➤</button>
  </div>
</div>

<script>
(function () {
  const fab      = document.getElementById('chatFab');
  const panel    = document.getElementById('chatPanel');
  const closeBtn = document.getElementById('chatClose');
  const messages = document.getElementById('chatMessages');
  const input    = document.getElementById('chatInput');
  const sendBtn  = document.getElementById('chatSend');

  let chatHistory = [];
  let isOpen      = false;
  let isTyping    = false;
  let initialized = false;

  fab.addEventListener('click', () => toggleChat());
  closeBtn.addEventListener('click', () => toggleChat(false));

  function toggleChat(force) {
    isOpen = force !== undefined ? force : !isOpen;
    panel.classList.toggle('open', isOpen);
    if (isOpen) input.focus();
  }

  // 자동 높이 조절
  input.addEventListener('input', () => {
    input.style.height = 'auto';
    input.style.height = Math.min(input.scrollHeight, 100) + 'px';
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  sendBtn.addEventListener('click', sendMessage);

  window.chatSuggest = function (text) {
    input.value = text;
    sendMessage();
  };

  async function sendMessage() {
    const text = input.value.trim();
    if (!text || isTyping) return;

    // 첫 메시지 보낼 때 초기 안내 제거
    if (!initialized) {
      messages.innerHTML = '';
      initialized = true;
    }

    appendMessage('user', text);
    input.value = '';
    input.style.height = 'auto';

    chatHistory.push({ role: 'user', content: text });

    const typingEl = appendTyping();
    isTyping = true;
    sendBtn.disabled = true;

    try {
      const res  = await fetch('api_chat.php', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ message: text, history: chatHistory.slice(-20) }),
      });
      const data = await res.json();

      typingEl.remove();

      if (data.error) {
        appendMessage('bot', '⚠️ ' + data.error);
      } else {
        appendBotResponse(data.message, data.bids || []);
        chatHistory.push({ role: 'assistant', content: data.message });
      }
    } catch {
      typingEl.remove();
      appendMessage('bot', '⚠️ 연결에 실패했습니다. 다시 시도해주세요.');
    } finally {
      isTyping = false;
      sendBtn.disabled = false;
      input.focus();
    }
  }

  function appendMessage(role, text) {
    const div = document.createElement('div');
    div.className = `chat-msg ${role}`;
    div.innerHTML = `<div class="chat-bubble">${escapeHtmlChat(text).replace(/\n/g, '<br>')}</div>`;
    messages.appendChild(div);
    scrollBottom();
    return div;
  }

  function appendBotResponse(text, bids) {
    const div = document.createElement('div');
    div.className = 'chat-msg bot';

    let html = `<div class="chat-bubble">${escapeHtmlChat(text).replace(/\n/g, '<br>')}</div>`;

    if (bids.length) {
      html += '<div class="chat-bid-list">';
      bids.forEach(b => {
        const deadline = (b.deadline_date && b.deadline_date !== '1970-01-01')
          ? `<span class="chat-bid-deadline">~${b.deadline_date}</span>` : '';
        html += `
          <div class="chat-bid-card">
            <a href="${escapeHtmlChat(b.url || '#')}" target="_blank" rel="noopener">${escapeHtmlChat(b.title)}</a>
            <div class="chat-bid-meta">
              <span class="chat-bid-source">${escapeHtmlChat(b.source)}</span>
              <span>${escapeHtmlChat(b.org_name)}</span>
              ${deadline}
            </div>
          </div>`;
      });
      html += '</div>';
    }

    div.innerHTML = html;
    messages.appendChild(div);
    scrollBottom();
  }

  function appendTyping() {
    const div = document.createElement('div');
    div.className = 'chat-msg bot';
    div.innerHTML = `<div class="chat-typing"><span></span><span></span><span></span></div>`;
    messages.appendChild(div);
    scrollBottom();
    return div;
  }

  function scrollBottom() {
    messages.scrollTop = messages.scrollHeight;
  }

  function escapeHtmlChat(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
})();
</script>
</body>
</html>
