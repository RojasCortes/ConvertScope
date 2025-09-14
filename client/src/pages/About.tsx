import { useEffect } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { ArrowLeft, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'wouter';

export function About() {
  const { t } = useTranslation();

  useEffect(() => {
    document.title = `${t('legal.about.title')} - ConvertScope`;
    
    // Meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', t('legal.about.description'));
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = t('legal.about.description');
      document.head.appendChild(meta);
    }

    // Open Graph tags
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) {
      ogTitle = document.createElement('meta');
      ogTitle.setAttribute('property', 'og:title');
      document.head.appendChild(ogTitle);
    }
    ogTitle.setAttribute('content', `${t('legal.about.title')} - ConvertScope`);

    let ogDescription = document.querySelector('meta[property="og:description"]');
    if (!ogDescription) {
      ogDescription = document.createElement('meta');
      ogDescription.setAttribute('property', 'og:description');
      document.head.appendChild(ogDescription);
    }
    ogDescription.setAttribute('content', t('legal.about.description'));
  }, [t]);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <div className="flex items-center gap-4 p-4 border-b">
        <Link href="/">
          <Button
            variant="ghost"
            size="icon"
            data-testid="button-back-about"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-xl font-semibold" data-testid="text-about-title">
          {t('legal.about.title')}
        </h1>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle data-testid="text-mission-title">
              {t('legal.about.title')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground leading-relaxed" data-testid="text-mission-description">
              {t('legal.about.mission')}
            </p>
            <p className="text-muted-foreground leading-relaxed" data-testid="text-app-description">
              {t('legal.about.description')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle data-testid="text-features-title">
              {t('legal.about.features')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {[
                t('legal.about.feature1'),
                t('legal.about.feature2'),
                t('legal.about.feature3'),
                t('legal.about.feature4'),
                t('legal.about.feature5')
              ].map((feature, index) => (
                <li key={index} className="flex items-start gap-3" data-testid={`text-feature-${index + 1}`}>
                  <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle data-testid="text-team-title">
              {t('legal.about.team')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed" data-testid="text-team-description">
              {t('legal.about.teamDescription')}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}