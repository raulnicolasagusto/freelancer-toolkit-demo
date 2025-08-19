"use client";

import { SignIn } from '@clerk/nextjs';
import { THEME_COLORS } from '@/lib/theme-colors';
import { t } from '@/lib/i18n';
import { LayoutDashboard } from 'lucide-react';

export default function SignInPage() {
  return (
    <div className={`min-h-screen flex items-center justify-center ${THEME_COLORS.main.bodyBackground} ${THEME_COLORS.main.bodyBackgroundDark}`}>
      <div className="w-full max-w-md">
        {/* Logo y Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className={`w-16 h-16 ${THEME_COLORS.logo.background} rounded-2xl flex items-center justify-center`}>
              <LayoutDashboard className={`w-8 h-8 ${THEME_COLORS.logo.icon}`} />
            </div>
          </div>
          <h1 className={`text-3xl font-bold ${THEME_COLORS.dashboard.title} mb-2`}>
            {t('app.name')}
          </h1>
          <p className={`${THEME_COLORS.dashboard.subtitle} text-sm`}>
            Dashboard premium para desarrolladores
          </p>
        </div>

        {/* Clerk Sign In Component */}
        <div className="flex justify-center">
          <SignIn 
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
              },
              layout: {
                socialButtonsPlacement: "top",
                socialButtonsVariant: "blockButton",
                termsPageUrl: "/terms",
                privacyPageUrl: "/privacy"
              }
            }}
            routing="hash"
            signUpUrl="/sign-up"
            redirectUrl="/"
          />
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