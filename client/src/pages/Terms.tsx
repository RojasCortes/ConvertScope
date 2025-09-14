import { useEffect } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { ArrowLeft, FileText, Info, AlertTriangle, Shield, Edit, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'wouter';

export function Terms() {
  const { t } = useTranslation();

  useEffect(() => {
    document.title = `${t('legal.terms.title')} - ConvertScope`;
    
    // Meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', t('legal.terms.intro'));
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = t('legal.terms.intro');
      document.head.appendChild(meta);
    }

    // Open Graph tags
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) {
      ogTitle = document.createElement('meta');
      ogTitle.setAttribute('property', 'og:title');
      document.head.appendChild(ogTitle);
    }
    ogTitle.setAttribute('content', `${t('legal.terms.title')} - ConvertScope`);

    let ogDescription = document.querySelector('meta[property="og:description"]');
    if (!ogDescription) {
      ogDescription = document.createElement('meta');
      ogDescription.setAttribute('property', 'og:description');
      document.head.appendChild(ogDescription);
    }
    ogDescription.setAttribute('content', t('legal.terms.intro'));
  }, [t]);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <div className="flex items-center gap-4 p-4 border-b">
        <Link href="/">
          <Button
            variant="ghost"
            size="icon"
            data-testid="button-back-terms"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-xl font-semibold" data-testid="text-terms-title">
          {t('legal.terms.title')}
        </h1>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              <CardTitle data-testid="text-terms-main-title">
                {t('legal.terms.title')}
              </CardTitle>
            </div>
            <p className="text-sm text-muted-foreground" data-testid="text-terms-last-updated">
              {t('legal.terms.lastUpdated')}
            </p>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed" data-testid="text-terms-intro">
              {t('legal.terms.intro')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2" data-testid="text-service-description-title">
              <Info className="h-5 w-5" />
              {t('legal.terms.serviceDescription')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed" data-testid="text-service-description-content">
              {t('legal.terms.serviceDescriptionText')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2" data-testid="text-accuracy-title">
              <AlertTriangle className="h-5 w-5" />
              {t('legal.terms.accuracy')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed" data-testid="text-accuracy-content">
              {t('legal.terms.accuracyText')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2" data-testid="text-restrictions-title">
              <Shield className="h-5 w-5" />
              {t('legal.terms.useRestrictions')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed" data-testid="text-restrictions-content">
              {t('legal.terms.useRestrictionsText')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2" data-testid="text-liability-title">
              <AlertTriangle className="h-5 w-5" />
              {t('legal.terms.liability')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed" data-testid="text-liability-content">
              {t('legal.terms.liabilityText')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2" data-testid="text-changes-title">
              <Edit className="h-5 w-5" />
              {t('legal.terms.changes')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed" data-testid="text-changes-content">
              {t('legal.terms.changesText')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2" data-testid="text-contact-terms-title">
              <Mail className="h-5 w-5" />
              Contacto
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed" data-testid="text-contact-terms-content">
              {t('legal.terms.contact')}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}