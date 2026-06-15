"use client";

import { GuideService, GuideSection as GuideSectionType } from "@/features/portal";
import { Stack, Card, Badge, cx } from "@/components";
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
    if (lightboxImg) {
      window.addEventListener("keydown", handleEsc);
    }
    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [lightboxImg, closeLightbox]);

  return (
    <div className="guide-main">
      <Stack spacing="lg">
        <div className="view-hero">
          <h1 className="view-hero-title">
            {service.title} <span>사용 설명서</span>
          </h1>
          <p className="text-subtitle">
            {service.description}
          </p>
        </div>

        {service.processFlow && (
          <div className="flow-grid">
            {service.processFlow.items.map((item) => (
              <Card key={item.step} variant="default" className="flow-card">
                <div className="flow-number">
                  {item.step}
                </div>
                <div className="flow-title">
                  {item.title}
                </div>
                <div className="flow-desc">
                  {item.description}
                </div>
              </Card>
            ))}
          </div>
        )}

        {service.sections.map((section) => (
          <GuideSection 
            key={section.id} 
            section={section} 
            onImageClick={(src, alt) => setLightboxImg({ src, alt })}
          />
        ))}
      </Stack>

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
              &times;
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
  onImageClick 
}: { 
  section: GuideSectionType;
  onImageClick: (src: string, alt: string) => void;
}) {
  return (
    <section id={section.id} className="guide-section">
      <Stack spacing="md">
        <h2 className="guide-section-title">
          <span className="guide-section-marker" />
          {section.title}
        </h2>
        {section.description && <p className="text-body">{section.description}</p>}

        <Stack spacing="lg">
          {section.cards.map((card) => (
            <Card key={card.id} variant="default" className="guide-card">
              {card.title && (
                <Card.Header className="guide-card-header">
                  <Card.Title className="guide-card-title">
                    {card.title}
                  </Card.Title>
                  {card.badge && <Badge variant="primary" soft size="sm">{card.badge}</Badge>}
                </Card.Header>
              )}
              <Card.Body className="guide-card-body">
                {card.content && <p className="text-body">{card.content}</p>}
                
                {card.steps && (
                  <ol className="guide-step-list">
                    {card.steps.map((step, idx) => (
                      <li key={idx} className="guide-step-item">
                        <div className="guide-step-number">
                          {idx + 1}
                        </div>
                        <div className="step-content">
                          <strong className="guide-step-title">{step.title}</strong>
                          <p className="text-body-sm">{step.description}</p>
                          {step.highlight && (
                            <div className={cx(
                              "guide-highlight",
                              step.highlight.type === "warn" ? "guide-highlight--warn" : "guide-highlight--info"
                            )}>
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
                        <span className="text-body-sm">{item.text}</span>
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
                        <div className="guide-faq-body">
                          {faq.answer}
                        </div>
                      </details>
                    ))}
                  </div>
                )}
              </Card.Body>
            </Card>
          ))}
        </Stack>
      </Stack>
    </section>
  );
}
