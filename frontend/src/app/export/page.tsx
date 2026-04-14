"use client";

import { useState } from "react";
import {
  DownloadSimple,
  UserPlus,
  ShareFat,
  RocketLaunch,
  X,
  MicrosoftPowerpointLogo,
  FilePdf,
  Image as ImageIcon,
} from "@phosphor-icons/react";

const sidebarItems = [
  {
    id: "export",
    label: "Export to Powerpoint",
    icon: DownloadSimple,
  },
  {
    id: "invite",
    label: "Invite to collaborate",
    icon: UserPlus,
  },
  {
    id: "share",
    label: "Share externally",
    icon: ShareFat,
  },
] as const;

const exportFormats = [
  {
    id: "pptx",
    label: "Power Points",
    icon: MicrosoftPowerpointLogo,
    iconColor: "text-orange-500",
  },
  {
    id: "gslides",
    label: "Google Slides",
    icon: () => (
      <svg
        viewBox="0 0 24 24"
        className="size-6"
        fill="none"
      >
        <rect x="3" y="1" width="18" height="22" rx="2" fill="#FBBC04" />
        <rect x="6" y="8" width="12" height="8" rx="1" fill="white" />
      </svg>
    ),
  },
  {
    id: "pdf",
    label: "PDF",
    icon: FilePdf,
    iconColor: "text-red-500",
  },
  {
    id: "images",
    label: "Images",
    icon: ImageIcon,
    iconColor: "text-blue-500",
  },
];

export default function ExportPage() {
  const [activeTab, setActiveTab] = useState("export");

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-primary">
      {/* Modal */}
      <div className="flex items-start gap-2">
        {/* Modal shell */}
        <div className="flex w-[808px] flex-col rounded-[var(--radius-3xl)] bg-bg-tertiary pb-1 px-1 shadow-elevation-4">
          {/* Header */}
          <div className="flex items-start px-6 py-4">
            <div className="flex flex-1 items-start justify-between">
              <h2 className="text-[length:var(--text-md)] font-medium leading-[var(--leading-heading)] text-text-primary">
                Export &ldquo;Airbnb Sales Pitch&rdquo;
              </h2>
            </div>
          </div>

          {/* Content */}
          <div className="flex h-[385px] overflow-hidden rounded-[var(--radius-2xl)] border border-border-primary bg-bg-primary">
            {/* Sidebar */}
            <div className="flex w-[220px] shrink-0 flex-col gap-2 overflow-hidden p-4">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex w-full items-center gap-2 rounded-[var(--radius-md)] p-1.5 text-left transition-colors ${
                      isActive
                        ? "bg-bg-quaternary text-text-primary"
                        : "text-text-secondary hover:bg-bg-secondary"
                    }`}
                  >
                    <Icon
                      weight={isActive ? "bold" : "regular"}
                      className="size-5 shrink-0"
                    />
                    <span className="text-[length:var(--text-base)] font-medium leading-[var(--leading-body)]">
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Divider */}
            <div className="w-px shrink-0 bg-border-primary" />

            {/* Export formats */}
            <div className="flex flex-1 flex-col gap-1 p-6">
              {exportFormats.map((format, i) => {
                const Icon = format.icon;
                return (
                  <div key={format.id}>
                    <div className="flex h-[60px] items-center justify-between rounded-[var(--radius-lg)] px-2.5 py-2 transition-colors hover:bg-bg-secondary">
                      <div className="flex items-center gap-2.5">
                        <div className={`size-6 shrink-0 ${format.iconColor ?? ""}`}>
                          <Icon className="size-6" weight="duotone" />
                        </div>
                        <span className="text-[length:var(--text-base)] font-medium leading-[var(--leading-body)] text-text-secondary">
                          {format.label}
                        </span>
                        <RocketLaunch
                          weight="duotone"
                          className="size-5 text-text-brand"
                        />
                      </div>
                      <button
                        className="rounded-[var(--radius-md)] p-1.5 text-text-secondary transition-colors hover:bg-bg-tertiary hover:text-text-primary"
                        aria-label={`Download as ${format.label}`}
                      >
                        <DownloadSimple className="size-5" />
                      </button>
                    </div>
                    {i < exportFormats.length - 1 && (
                      <div className="h-px bg-border-secondary" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Dismiss button */}
        <button
          className="flex size-7 items-center justify-center rounded-full bg-bg-secondary shadow-elevation-2 transition-colors hover:bg-bg-tertiary"
          aria-label="Close"
        >
          <X className="size-5 text-text-secondary" />
        </button>
      </div>
    </div>
  );
}
