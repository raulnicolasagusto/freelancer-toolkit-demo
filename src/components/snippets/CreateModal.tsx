'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, Code } from 'lucide-react';
import { t } from '@/lib/i18n';
import { THEME_COLORS } from '@/lib/theme-colors';
import { useRouter } from 'next/navigation';

interface CreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentFolderId?: string | null;
}

export default function CreateModal({ isOpen, onClose, currentFolderId }: CreateModalProps) {
  const router = useRouter();

  const handleSelectType = (type: 'markdown' | 'snippet') => {
    onClose();
    const folderParam = currentFolderId ? `&folder=${currentFolderId}` : '';
    router.push(`/snippets/create?type=${type}${folderParam}`);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{
                type: 'spring',
                duration: 0.5,
                bounce: 0.3
              }}
              className={`
                relative w-full max-w-md mx-auto
                ${THEME_COLORS.dashboard.card.background}
                rounded-2xl shadow-2xl border ${THEME_COLORS.dashboard.card.border}
                overflow-hidden
              `}
            >
              {/* Header */}
              <div className="p-6 border-b ${THEME_COLORS.dashboard.card.border}">
                <div className="flex items-center justify-between">
                  <h2 className={`text-xl font-semibold ${THEME_COLORS.dashboard.title}`}>
                    Crea un Markdown o un Snippet
                  </h2>
                  <button
                    onClick={onClose}
                    className={`
                      p-2 rounded-lg 
                      ${THEME_COLORS.buttons.quickAction.background}
                      ${THEME_COLORS.dashboard.subtitle} hover:${THEME_COLORS.dashboard.title}
                      ${THEME_COLORS.transitions.all}
                    `}
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="grid grid-cols-1 gap-4">
                  {/* Markdown Option */}
                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSelectType('markdown')}
                    className={`
                      group relative overflow-hidden
                      p-6 rounded-xl border-2 border-transparent
                      ${THEME_COLORS.dashboard.card.background}
                      hover:border-blue-500/20 hover:shadow-lg hover:shadow-blue-500/10
                      ${THEME_COLORS.transitions.all}
                      text-left
                    `}
                  >
                    <div className="flex items-start space-x-4">
                      <div className={`
                        p-3 rounded-lg ${THEME_COLORS.icons.iconBackgrounds.blue}
                        group-hover:scale-110 ${THEME_COLORS.transitions.transform}
                      `}>
                        <FileText className={`w-6 h-6 ${THEME_COLORS.icons.snippets}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className={`font-semibold text-lg mb-2 ${THEME_COLORS.dashboard.title}`}>
                          Markdown Note
                        </h3>
                        <p className={`text-sm ${THEME_COLORS.dashboard.subtitle} leading-relaxed`}>
                          This format is for creating text documents, checklists, code blocks and Latex blocks are available.
                        </p>
                      </div>
                    </div>
                    
                    {/* Hover effect overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </motion.button>

                  {/* Snippet Option */}
                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSelectType('snippet')}
                    className={`
                      group relative overflow-hidden
                      p-6 rounded-xl border-2 border-transparent
                      ${THEME_COLORS.dashboard.card.background}
                      hover:border-purple-500/20 hover:shadow-lg hover:shadow-purple-500/10
                      ${THEME_COLORS.transitions.all}
                      text-left
                    `}
                  >
                    <div className="flex items-start space-x-4">
                      <div className={`
                        p-3 rounded-lg ${THEME_COLORS.icons.iconBackgrounds.purple}
                        group-hover:scale-110 ${THEME_COLORS.transitions.transform}
                      `}>
                        <Code className={`w-6 h-6 ${THEME_COLORS.icons.resources}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className={`font-semibold text-lg mb-2 ${THEME_COLORS.dashboard.title}`}>
                          Snippet Note
                        </h3>
                        <p className={`text-sm ${THEME_COLORS.dashboard.subtitle} leading-relaxed`}>
                          This format is for creating code snippets. Multiple snippets can be grouped into a single note.
                        </p>
                      </div>
                    </div>
                    
                    {/* Hover effect overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </motion.button>
                </div>

                {/* Tab hint */}
                <div className="mt-6 text-center">
                  <p className={`text-xs ${THEME_COLORS.dashboard.metadata}`}>
                    ←→Tab to switch format
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}