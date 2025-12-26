'use client';

import { FiPlus, FiDownload, FiUpload, FiX } from "react-icons/fi";

interface HelpSectionProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HelpSection({ isOpen, onClose }: HelpSectionProps) {
  if (!isOpen) return null;

  return (
    <div className="p-4 sm:p-6 border-b" style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--border)" }}>
      <div className="rounded-lg border p-4 sm:p-6 space-y-4" style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--border)" }}>
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-semibold" style={{ color: 'var(--text)' }}>
            How to Use FinBoard
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:opacity-80 transition-opacity"
            style={{ color: 'var(--text)' }}
          >
            <FiX size={20} />
          </button>
        </div>

        <div className="space-y-4">
          {/* How to Create Widget */}
          <div>
            <h3 className="text-base font-semibold mb-2 flex items-center gap-2" style={{ color: 'var(--text)' }}>
              <FiPlus size={16} />
              How to Create a Widget
            </h3>
            <ol className="list-decimal list-inside space-y-1 text-sm sm:text-base" style={{ color: 'var(--text)', opacity: 0.9 }}>
              <li>Click the <strong>"Add Widget"</strong> button in the header or the floating button near the cards</li>
              <li>Enter a valid API URL in the input field</li>
              <li>Click <strong>"Test API"</strong> to validate the URL (button turns green when successful)</li>
              <li>Select the data fields/attributes you want to display from the API response</li>
              <li>Enter a name for your widget</li>
              <li>Set the refresh interval (in seconds) for automatic data updates</li>
              <li>Choose the widget type: Card, Table, or Chart</li>
              <li>Click <strong>"Create Widget"</strong> to add it to your dashboard</li>
            </ol>
          </div>

          {/* How to Export */}
          <div>
            <h3 className="text-base font-semibold mb-2 flex items-center gap-2" style={{ color: 'var(--text)' }}>
              <FiDownload size={16} />
              How to Export
            </h3>
            <ol className="list-decimal list-inside space-y-1 text-sm sm:text-base" style={{ color: 'var(--text)', opacity: 0.9 }}>
              <li>Click the <strong>"Export"</strong> button in the header</li>
              <li>A JSON file will be downloaded containing all your widgets, layout, and theme settings</li>
              <li>Save this file to backup your dashboard configuration</li>
              <li>You can share this file with others or use it to restore your dashboard later</li>
            </ol>
          </div>

          {/* How to Import */}
          <div>
            <h3 className="text-base font-semibold mb-2 flex items-center gap-2" style={{ color: 'var(--text)' }}>
              <FiUpload size={16} />
              How to Import
            </h3>
            <ol className="list-decimal list-inside space-y-1 text-sm sm:text-base" style={{ color: 'var(--text)', opacity: 0.9 }}>
              <li>Click the <strong>"Import"</strong> button in the header</li>
              <li>Select a JSON file that was previously exported from FinBoard</li>
              <li>Your dashboard will be restored with all widgets, layout, and theme settings</li>
              <li>All widgets will automatically start polling their respective APIs</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}

