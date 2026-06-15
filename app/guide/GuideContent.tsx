import { GuideService, GuideSection as GuideSectionType } from "@/features/portal";
import { Stack, Card, Badge, cx } from "@/components";
import Image from "next/image";

interface GuideContentProps {
  service: GuideService;
}

export function GuideContent({ service }: GuideContentProps) {
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
          <GuideSection key={section.id} section={section} />
        ))}
      </Stack>
    </div>
  );
}

function GuideSection({ section }: { section: GuideSectionType }) {
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
                  <div className="guide-image-wrap">
                    <Image
                      src={card.image.src}
                      alt={card.image.alt}
                      width={1024}
                      height={768}
                    />
                  </div>
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
