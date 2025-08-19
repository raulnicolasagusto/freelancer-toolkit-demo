"use client";

import { SignUp } from '@clerk/nextjs';
import { THEME_COLORS } from '@/lib/theme-colors';
import { t } from '@/lib/i18n';
import { LayoutDashboard, Mail, Shield } from 'lucide-react';

export default function SignUpPage() {
  return (
    <div className={`min-h-screen flex items-center justify-center ${THEME_COLORS.main.bodyBackground} ${THEME_COLORS.main.bodyBackgroundDark}`}>
      <div className="w-full max-w-md">
        {/* Logo y Header */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <div className={`w-16 h-16 ${THEME_COLORS.logo.background} rounded-2xl flex items-center justify-center`}>
              <LayoutDashboard className={`w-8 h-8 ${THEME_COLORS.logo.icon}`} />
            </div>
          </div>
          <h1 className={`text-3xl font-bold ${THEME_COLORS.dashboard.title} mb-2`}>
            Únete a {t('app.name')}
          </h1>
          <p className={`${THEME_COLORS.dashboard.subtitle} text-sm`}>
            Crea tu cuenta premium de desarrollador
          </p>
        </div>

        {/* Info sobre métodos de registro */}
        <div className={`${THEME_COLORS.dashboard.card.background} border ${THEME_COLORS.dashboard.card.border} rounded-lg p-4 mb-6`}>
          <div className="flex items-start gap-3">
            <div className={`${THEME_COLORS.icons.iconBackgrounds.blue} p-2 rounded-lg mt-0.5`}>
              <Mail className={`w-4 h-4 ${THEME_COLORS.icons.snippets}`} />
            </div>
            <div>
              <h3 className={`font-medium ${THEME_COLORS.dashboard.title} text-sm mb-1`}>
                Registro Rápido y Seguro
              </h3>
              <p className={`text-xs ${THEME_COLORS.dashboard.subtitle} leading-relaxed`}>
                Regístrate con Google para acceso inmediato, o usa tu email. Tu cuenta estará protegida automáticamente.
              </p>
            </div>
          </div>
        </div>

        {/* Clerk Sign Up Component */}
        <div className="flex justify-center">
          <SignUp 
            appearance={{
              elements: {
                rootBox: "w-full",
                card: `${THEME_COLORS.dashboard.card.background} border ${THEME_COLORS.dashboard.card.border} shadow-lg rounded-xl`,
                headerTitle: `${THEME_COLORS.dashboard.title} text-xl font-semibold`,
                headerSubtitle: `${THEME_COLORS.dashboard.subtitle}`,
                socialButtonsBlockButton: `border ${THEME_COLORS.buttons.quickAction.border} ${THEME_COLORS.buttons.quickAction.background} ${THEME_COLORS.transitions.default}`,
                formFieldLabel: `${THEME_COLORS.dashboard.title} font-medium`,
                formFieldInput: `border ${THEME_COLORS.dashboard.card.border} bg-transparent ${THEME_COLORS.dashboard.title}`,
                formButtonPrimary: `${THEME_COLORS.logo.background} ${THEME_COLORS.logo.icon} hover:opacity-90 ${THEME_COLORS.transitions.default}`,
                footerActionLink: `${THEME_COLORS.sidebar.footer.accent} hover:underline`,
                dividerLine: `${THEME_COLORS.dashboard.card.border}`,
                dividerText: `${THEME_COLORS.dashboard.subtitle}`,
                identityPreviewText: `${THEME_COLORS.dashboard.title}`,
                identityPreviewEditButton: `${THEME_COLORS.sidebar.footer.accent}`,
                // Estilos específicos para verificación
                formResendCodeLink: `${THEME_COLORS.sidebar.footer.accent} hover:underline text-sm`,
                otpCodeFieldInput: `border ${THEME_COLORS.dashboard.card.border} bg-transparent ${THEME_COLORS.dashboard.title} text-center font-mono`,
                verificationLinkStatusBox: `${THEME_COLORS.dashboard.card.background} border ${THEME_COLORS.dashboard.card.border}`,
                verificationLinkStatusText: `${THEME_COLORS.dashboard.title}`,
                // Estilos para el paso de verificación
                formFieldSuccessText: `${THEME_COLORS.dashboard.stats.trend.positive}`,
                formFieldErrorText: `text-red-500`,
                formFieldHintText: `${THEME_COLORS.dashboard.subtitle} text-xs`,
              },
              layout: {
                socialButtonsPlacement: "top",
                socialButtonsVariant: "blockButton",
                termsPageUrl: "/terms",
                privacyPageUrl: "/privacy"
              },
              variables: {
                // Variables CSS personalizadas para mejor integración
                colorPrimary: '#3B82F6', // blue-500
                colorBackground: 'transparent',
                colorInputBackground: 'transparent',
                colorInputText: '#0F172A', // slate-900
              }
            }}
            routing="hash"
            signInUrl="/sign-in"
            redirectUrl="/"
          />
        </div>

        {/* Info adicional sobre seguridad */}
        <div className={`${THEME_COLORS.dashboard.card.background} border ${THEME_COLORS.dashboard.card.border} rounded-lg p-4 mt-6`}>
          <div className="flex items-center gap-3">
            <div className={`${THEME_COLORS.icons.iconBackgrounds.green} p-2 rounded-lg`}>
              <Shield className={`w-4 h-4 ${THEME_COLORS.icons.productivity}`} />
            </div>
            <div>
              <p className={`text-xs ${THEME_COLORS.dashboard.subtitle} leading-relaxed`}>
                <span className={`font-medium ${THEME_COLORS.dashboard.title}`}>Seguro y protegido:</span> Tu información está encriptada y protegida con los más altos estándares de seguridad.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className={`text-xs ${THEME_COLORS.sidebar.footer.text}`}>
            {t('app.name')} {t('app.version')} - {t('app.edition')}
          </p>
        </div>
      </div>
    </div>
  );
}