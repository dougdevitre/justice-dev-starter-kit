/**
 * @module AuditBanner
 * @description Banner component showing audit logging status.
 * Indicates to users that their actions are being logged for compliance.
 */

import React from 'react';

interface AuditBannerProps {
  /** Whether audit logging is active */
  isActive?: boolean;
}

/**
 * AuditBanner shows a compliance notice about audit logging.
 */
export const AuditBanner: React.FC<AuditBannerProps> = ({ isActive = true }) => {
  if (!isActive) return null;

  return (
    <div className="bg-blue-50 border-b border-blue-200 px-4 py-2 text-center text-sm text-blue-700">
      All actions are logged for compliance and quality assurance.
    </div>
  );
};
