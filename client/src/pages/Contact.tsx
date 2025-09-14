import { useEffect } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { ArrowLeft, Mail, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'wouter';

export function Contact() {
  const { t } = useTranslation();

  useEffect(() => {
    document.title = `${t('legal.contact.title')} - ConvertScope`;
    
    // Meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', t('legal.contact.description'));
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = t('legal.contact.description');
      document.head.appendChild(meta);
    }

    // Open Graph tags
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) {
      ogTitle = document.createElement('meta');
      ogTitle.setAttribute('property', 'og:title');
      document.head.appendChild(ogTitle);
    }
    ogTitle.setAttribute('content', `${t('legal.contact.title')} - ConvertScope`);

    let ogDescription = document.querySelector('meta[property="og:description"]');
    if (!ogDescription) {
      ogDescription = document.createElement('meta');
      ogDescription.setAttribute('property', 'og:description');
      document.head.appendChild(ogDescription);
    }
    ogDescription.setAttribute('content', t('legal.contact.description'));
  }, [t]);

  const handleEmailClick = () => {
    window.open(`mailto:${t('legal.contact.emailAddress')}?subject=ConvertScope - Consulta`, '_blank');
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <div className="flex items-center gap-4 p-4 border-b">
        <Link href="/">
          <Button
            variant="ghost"
            size="icon"
            data-testid="button-back-contact"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-xl font-semibold" data-testid="text-contact-title">
          {t('legal.contact.title')}
        </h1>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle data-testid="text-contact-subtitle">
              {t('legal.contact.subtitle')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground leading-relaxed" data-testid="text-contact-description">
              {t('legal.contact.description')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2" data-testid="text-email-title">
              <Mail className="h-5 w-5" />
              {t('legal.contact.email')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span className="font-mono text-sm" data-testid="text-email-address">
                  {t('legal.contact.emailAddress')}
                </span>
                <Button 
                  onClick={handleEmailClick}
                  size="sm"
                  data-testid="button-send-email"
                >
                  {t('legal.contact.sendEmail')}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium" data-testid="text-contact-types">
                Tipos de consultas:
              </h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li data-testid="text-support-type">• {t('legal.contact.support')}</li>
                <li data-testid="text-suggestions-type">• {t('legal.contact.suggestions')}</li>
                <li data-testid="text-business-type">• {t('legal.contact.business')}</li>
              </ul>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground" data-testid="text-response-time">
              <Clock className="h-4 w-4" />
              {t('legal.contact.responseTime')}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}