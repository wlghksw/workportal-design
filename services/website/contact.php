<?php
declare(strict_types=1);

require __DIR__ . '/config.php';

$sent = isset($_GET['sent']) && $_GET['sent'] === '1';
$error = '';
$form = [
  'company' => '',
  'name' => '',
  'phone' => '',
  'email' => '',
  'message' => '',
];

$allowedExt = ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'xlsx', 'xls', 'zip', 'hwp', 'hwpx'];
$extToMime = [
  'pdf' => 'application/pdf',
  'doc' => 'application/msword',
  'docx' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'ppt' => 'application/vnd.ms-powerpoint',
  'pptx' => 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'xlsx' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'xls' => 'application/vnd.ms-excel',
  'zip' => 'application/zip',
  'hwp' => 'application/x-hwp',
  'hwpx' => 'application/hwpx+zip',
];

require_once __DIR__ . '/includes/Mailer.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  try {
    if (trim((string) ($_POST['website'] ?? '')) !== '') {
      header('Location: contact.php?sent=1', true, 303);
      exit;
    }

    $form['company'] = trim((string) ($_POST['company'] ?? ''));
    $form['name'] = trim((string) ($_POST['name'] ?? ''));
    $form['phone'] = trim((string) ($_POST['phone'] ?? ''));
    $form['email'] = trim((string) ($_POST['email'] ?? ''));
    $form['message'] = trim((string) ($_POST['message'] ?? ''));

    if ($form['company'] === '' || $form['name'] === '' || $form['phone'] === '' || $form['email'] === '' || $form['message'] === '') {
      $error = '회사명, 담당자명, 연락처, 이메일, 문의 내용은 필수입니다.';
    } elseif (!filter_var($form['email'], FILTER_VALIDATE_EMAIL)) {
      $error = '이메일 주소 형식을 확인해 주세요.';
    } elseif (mb_strlen($form['message']) > 8000) {
      $error = '문의 내용이 너무 깁니다. 8000자 이내로 작성해 주세요.';
    } else {
      $attach = null;
      $fileErr = isset($_FILES['attachment']) ? (int) ($_FILES['attachment']['error'] ?? UPLOAD_ERR_NO_FILE) : UPLOAD_ERR_NO_FILE;
      if ($fileErr !== UPLOAD_ERR_NO_FILE) {
        if ($fileErr !== UPLOAD_ERR_OK) {
          $error = '파일 업로드에 실패했습니다. (용량·형식을 확인해 주세요)';
        } elseif (($_FILES['attachment']['size'] ?? 0) > 5 * 1024 * 1024) {
          $error = '첨부 파일은 5MB 이하여야 합니다.';
        } else {
          $origName = (string) ($_FILES['attachment']['name'] ?? 'file');
          $ext = strtolower(pathinfo($origName, PATHINFO_EXTENSION));
          if (!in_array($ext, $allowedExt, true)) {
            $error = '첨부는 pdf, doc, docx, ppt, pptx, xlsx, xls, zip, hwp, hwpx 만 가능합니다.';
          } else {
            $mime = $extToMime[$ext] ?? 'application/octet-stream';
            $safeName = 'attach_' . date('Ymd_His') . '_' . bin2hex(random_bytes(3)) . '.' . $ext;
            $attach = [
              'path' => (string) $_FILES['attachment']['tmp_name'],
              'name' => $safeName,
              'mime' => $mime,
              'original' => $origName,
            ];
          }
        }
      }

      if ($error === '') {
        $to = $contactRecipient;
        $subject = '[Platformers] 문의하기 — ' . mb_substr($form['company'], 0, 40);
        $bodyLines = [
          '플랫포머즈 웹 문의 폼에서 접수되었습니다.',
          '',
          '회사명: ' . $form['company'],
          '담당자: ' . $form['name'],
          '연락처: ' . $form['phone'],
          '이메일: ' . $form['email'],
          '',
          '--- 문의 내용 ---',
          $form['message'],
          '',
        ];
        if ($attach !== null) {
          $bodyLines[] = '첨부 파일 (원본명): ' . $attach['original'];
        }
        $bodyLines[] = '---';
        $bodyLines[] = 'IP: ' . ($_SERVER['REMOTE_ADDR'] ?? '');
        $bodyLines[] = '일시: ' . date('Y-m-d H:i:s T');
        $body = implode("\n", $bodyLines);

        // SMTP 메일러 실행
        $mailer = new \Platformers\SmtpMailer($smtpSettings);
        $ok = $mailer->send($to, $subject, $body, $form['email'], $attach);

        if ($ok) {
          header('Location: contact.php?sent=1', true, 303);
          exit;
        }

        $error = '메일 전송에 실패했습니다. (설정 확인 필요)';
        if (isset($smtpSettings['debug']) && $smtpSettings['debug']) {
          $error .= "\n\n[Debug Logs]\n" . implode("\n", $mailer->getLogs());
        }
      }
    }
  } catch (\Exception $e) {
    $error = '시스템 오류가 발생했습니다: ' . $e->getMessage();
  }
}
?>
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
  <title>문의하기 — PLATFORMERS</title>
  <link rel="stylesheet" href="static/css/main.css?v=32">
</head>
<body>

<div class="grid-bg"></div>
<div class="cursor" id="cursor"></div>
<div class="cursor-ring" id="cursorRing"></div>

<nav>
  <a href="index.php" class="nav-logo">
    <img class="nav-logo-icon" src="static/img/logo-icon-v2-transparent.png?v=19" alt="Platformers">
    <img class="nav-logo-wordmark" src="static/img/logo-wordmark-transparent.png?v=19" alt="Platformers — 기업용 AI·웹·앱 개발">
  </a>
  <ul class="nav-links">
    <li><a href="index.php#about">About</a></li>
    <li><a href="index.php#services">Services</a></li>
    <li><a href="portfolio.php">Work</a></li>
    <li><a href="index.php#process">Process</a></li>
  </ul>
  <a href="contact.php" class="nav-cta">Contact Us</a>
</nav>

<main class="contact-page">
  <div class="contact-inner contact-inner--wide">
    <?php if ($sent): ?>
      <div class="contact-sheet contact-sheet--narrow">
        <div class="contact-alert contact-alert--ok reveal visible" role="status">
          전송되었습니다. 빠른 시일 내에 연락드리겠습니다.
        </div>
        <p class="contact-after reveal visible">
          <a href="index.php" class="contact-submit contact-submit--inline">홈으로 돌아가기</a>
        </p>
      </div>
    <?php else: ?>

    <?php if ($error !== ''): ?>
      <div class="contact-alert contact-alert--err reveal visible" role="alert">
        <?php echo htmlspecialchars($error); ?>
      </div>
    <?php endif; ?>

    <form class="contact-sheet contact-form contact-form--corp reveal" method="post" action="contact.php" enctype="multipart/form-data" novalidate>
      <p class="contact-honeypot" aria-hidden="true">
        <label>웹사이트 <input type="text" name="website" tabindex="-1" autocomplete="off"></label>
      </p>

      <div class="contact-sheet-head">
        <div class="contact-sheet-titles">
          <h1 class="contact-sheet-title">문의하기</h1>
          <p class="contact-required-note"><span class="contact-req">*</span> 필수 입력값은 반드시 기입해주세요.</p>
        </div>
      </div>

      <div class="contact-fields-grid">
        <label class="contact-field contact-field--light">
          <span class="contact-label contact-label--light">회사명 <span class="contact-req">*</span></span>
          <input class="contact-input contact-input--light" type="text" name="company" required maxlength="200"
                 placeholder="회사 상호명을 입력해주세요."
                 value="<?php echo htmlspecialchars($form['company']); ?>">
        </label>
        <label class="contact-field contact-field--light">
          <span class="contact-label contact-label--light">담당자명 <span class="contact-req">*</span></span>
          <input class="contact-input contact-input--light" type="text" name="name" required maxlength="120"
                 placeholder="담당자 이름을 입력해주세요."
                 value="<?php echo htmlspecialchars($form['name']); ?>">
        </label>
        <label class="contact-field contact-field--light">
          <span class="contact-label contact-label--light">연락처 <span class="contact-req">*</span></span>
          <input class="contact-input contact-input--light" type="text" name="phone" required maxlength="40"
                 placeholder="연락처를 입력해주세요."
                 value="<?php echo htmlspecialchars($form['phone']); ?>">
        </label>
        <label class="contact-field contact-field--light">
          <span class="contact-label contact-label--light">이메일 <span class="contact-req">*</span></span>
          <input class="contact-input contact-input--light" type="email" name="email" required maxlength="254"
                 placeholder="이메일 주소를 입력해주세요."
                 value="<?php echo htmlspecialchars($form['email']); ?>">
        </label>
      </div>

      <label class="contact-field contact-field--light contact-field--full">
        <span class="contact-label contact-label--light">문의내용 <span class="contact-req">*</span></span>
        <textarea class="contact-textarea contact-textarea--light" name="message" required maxlength="8000" rows="8"
                  placeholder="문의하실 내용을 입력해주세요."><?php echo htmlspecialchars($form['message']); ?></textarea>
      </label>

      <div class="contact-file-block">
        <p class="contact-file-hint">회사소개서, 제안서 등 파일이 있으면 전달 부탁드립니다. <span class="contact-file-limit">(5MB 이하)</span></p>
        <div class="contact-file-row">
          <input class="contact-file-input" type="file" name="attachment" id="contactAttachment"
                 accept=".pdf,.doc,.docx,.ppt,.pptx,.xlsx,.xls,.zip,.hwp,.hwpx,application/pdf">
          <label for="contactAttachment" class="contact-file-btn">파일첨부</label>
          <span class="contact-file-name" id="contactFileName" aria-live="polite"></span>
        </div>
      </div>

      <div class="contact-actions contact-actions--corp">
        <button type="submit" class="contact-submit">문의 보내기</button>
        <a href="index.php" class="contact-cancel-link">취소</a>
      </div>
    </form>
    <?php endif; ?>
  </div>
</main>

<footer>
  <div class="footer-logo">Platformers<span style="color:var(--accent2)">.</span></div>
  <ul class="footer-links">
    <li><a href="index.php#about">About</a></li>
    <li><a href="index.php#services">Services</a></li>
    <li><a href="portfolio.php">Work</a></li>
    <li><a href="index.php#process">Process</a></li>
    <li><a href="contact.php">Contact</a></li>
  </ul>
  <div class="footer-copy">© 2026 Platformers. All rights reserved.</div>
</footer>

<script src="static/js/main.js?v=32"></script>
<script>
(function () {
  var input = document.getElementById('contactAttachment');
  var out = document.getElementById('contactFileName');
  if (input && out) {
    input.addEventListener('change', function () {
      var f = input.files && input.files[0];
      out.textContent = f ? f.name : '';
    });
  }
})();
</script>
</body>
</html>
