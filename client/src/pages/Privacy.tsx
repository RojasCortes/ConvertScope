import { useEffect } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { ArrowLeft, Shield, Database, Eye, Cookie, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'wouter';

export function Privacy() {
  const { t } = useTranslation();

  useEffect(() => {
    document.title = `${t('legal.privacy.title')} - ConvertScope`;
    
    // Meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', t('legal.privacy.intro'));
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = t('legal.privacy.intro');
      document.head.appendChild(meta);
    }

    // Open Graph tags
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) {
      ogTitle = document.createElement('meta');
      ogTitle.setAttribute('property', 'og:title');
      document.head.appendChild(ogTitle);
    }
    ogTitle.setAttribute('content', `${t('legal.privacy.title')} - ConvertScope`);

    let ogDescription = document.querySelector('meta[property="og:description"]');
    if (!ogDescription) {
      ogDescription = document.createElement('meta');
      ogDescription.setAttribute('property', 'og:description');
      document.head.appendChild(ogDescription);
    }
    ogDescription.setAttribute('content', t('legal.privacy.intro'));
  }, [t]);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <div className="flex items-center gap-4 p-4 border-b">
        <Link href="/">
          <Button
            variant="ghost"
            size="icon"
            data-testid="button-back-privacy"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-xl font-semibold" data-testid="text-privacy-title">
          {t('legal.privacy.title')}
        </h1>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              <CardTitle data-testid="text-privacy-main-title">
                {t('legal.privacy.title')}
              </CardTitle>
            </div>
            <p className="text-sm text-muted-foreground" data-testid="text-last-updated">
              {t('legal.privacy.lastUpdated')}
            </p>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed" data-testid="text-privacy-intro">
              {t('legal.privacy.intro')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2" data-testid="text-data-collection-title">
              <Database className="h-5 w-5" />
              {t('legal.privacy.dataCollection')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed" data-testid="text-data-collection-content">
              {t('legal.privacy.dataCollectionText')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2" data-testid="text-data-usage-title">
              <Eye className="h-5 w-5" />
              {t('legal.privacy.dataUsage')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed" data-testid="text-data-usage-content">
              {t('legal.privacy.dataUsageText')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2" data-testid="text-advertising-title">
              <Eye className="h-5 w-5" />
              {t('legal.privacy.advertising')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed" data-testid="text-advertising-content">
              {t('legal.privacy.advertisingText')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2" data-testid="text-cookies-title">
              <Cookie className="h-5 w-5" />
              {t('legal.privacy.cookies')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed" data-testid="text-cookies-content">
              {t('legal.privacy.cookiesText')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2" data-testid="text-contact-privacy-title">
              <Mail className="h-5 w-5" />
              Contacto
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed" data-testid="text-contact-privacy-content">
              {t('legal.privacy.contact')}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}