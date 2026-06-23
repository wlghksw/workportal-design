"use client";

import { GuideService, GuideSection as GuideSectionType } from "@/features/portal";
import Image from "next/image";
import { useState, useEffect, useCallback } from "react";

interface GuideContentProps {
  service: GuideService;
}

export function GuideContent({ service }: GuideContentProps) {
  const [lightboxImg, setLightboxImg] = useState<{ src: string; alt: string } | null>(null);

  const closeLightbox = useCallback(() => setLightboxImg(null), []);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
    };
    if (lightboxImg) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [lightboxImg, closeLightbox]);

  return (
    <div>
      {/* 서비스 헤더 */}
      <div className="guide-hero">
        <span className="guide-hero__badge">이용 가이드</span>
        <h1 className="guide-hero__title">{service.title}</h1>
        <p className="guide-hero__desc">{service.description}</p>
      </div>

      {/* 프로세스 플로우 */}
      {service.processFlow && (
        <div className="guide-flow-grid">
          {service.processFlow.items.map((item) => (
            <a
              key={item.step}
              href={item.targetId ? `#${item.targetId}` : undefined}
              className="guide-flow-card"
            >
              <div className="guide-flow-num">{item.step}</div>
              <div className="guide-flow-title">{item.title}</div>
              <div className="guide-flow-desc">{item.description}</div>
            </a>
          ))}
        </div>
      )}

      {/* 섹션 목록 */}
      {service.sections.map((section) => (
        <GuideSection
          key={section.id}
          section={section}
          onImageClick={(src, alt) => setLightboxImg({ src, alt })}
        />
      ))}

      {/* 라이트박스 */}
      {lightboxImg && (
        <div
          className="lightbox-overlay"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-label="이미지 크게 보기"
        >
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="lightbox-close"
              onClick={closeLightbox}
              aria-label="닫기"
            >
              ×
            </button>
            <div className="lightbox-image-container">
              <Image
                src={lightboxImg.src}
                alt={lightboxImg.alt}
                fill
                className="lightbox-image"
                unoptimized
              />
            </div>
            <p className="lightbox-caption">{lightboxImg.alt}</p>
          </div>
        </div>
      )}
    </div>
  );
}

function GuideSection({
  section,
  onImageClick,
}: {
  section: GuideSectionType;
  onImageClick: (src: string, alt: string) => void;
}) {
  return (
    <section id={section.id} className="guide-section">
      <div className="guide-section-header">
        <span className="guide-section-marker" />
        <h2 className="guide-section-title">{section.title}</h2>
      </div>
      {section.description && (
        <p className="guide-section-desc">{section.description}</p>
      )}

      {section.cards.map((card) => (
        <div key={card.id} id={card.id} className="guide-card">
          {card.title && (
            <div className="guide-card-header">
              <h3 className="guide-card-title">{card.title}</h3>
              {card.badge && (
                <span className="guide-card-badge">{card.badge}</span>
              )}
            </div>
          )}
          <div className="guide-card-body">
            {card.content && (
              <p className="guide-card-text">{card.content}</p>
            )}

            {card.steps && (
              <ol className="guide-step-list">
                {card.steps.map((step, idx) => (
                  <li key={idx} className="guide-step-item">
                    <div className="guide-step-number">{idx + 1}</div>
                    <div className="guide-step-content">
                      <strong className="guide-step-title">{step.title}</strong>
                      <p className="guide-step-desc">{step.description}</p>
                      {step.highlight && (
                        <div
                          className={`guide-highlight guide-highlight--${step.highlight.type}`}
                        >
                          <div className="guide-highlight-title">{step.highlight.title}</div>
                          <div className="guide-highlight-text">{step.highlight.text}</div>
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            )}

            {card.image && (
              <button
                type="button"
                className="guide-image-button"
                onClick={() => onImageClick(card.image!.src, card.image!.alt)}
                aria-label={`이미지 크게 보기: ${card.image.alt}`}
              >
                <Image
                  src={card.image.src}
                  alt={card.image.alt}
                  width={1024}
                  height={768}
                />
              </button>
            )}

            {card.checklist && (
              <ul className="guide-checklist">
                {card.checklist.map((item) => (
                  <li key={item.id} className="guide-checklist-item">
                    <input type="checkbox" readOnly />
                    <span>{item.text}</span>
                  </li>
                ))}
              </ul>
            )}

            {card.faqs && (
              <div className="guide-faq-list">
                {card.faqs.map((faq) => (
                  <details key={faq.id} className="guide-faq-item">
                    <summary className="guide-faq-summary">
                      Q{faq.id}. {faq.question}
                    </summary>
                    <div className="guide-faq-body">{faq.answer}</div>
                  </details>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </section>
  );
}
