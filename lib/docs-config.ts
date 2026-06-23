export interface DocPage {
  path: string;
  title: string;
  description: string;
}

export interface DocSection {
  section: string;
  pages: DocPage[];
}

export const DOCS_NAV: DocSection[] = [
  {
    section: "Getting Started",
    pages: [
      { path: "quickstart", title: "Quick-start guide", description: "Unbox, mount, and get your first position fix in under 10 minutes." },
      { path: "mounting", title: "Mounting & orientation", description: "Correct physical installation and camera orientation for accurate readings." },
      { path: "power", title: "Power requirements", description: "Safely power the Macula module from your drone's power system." },
    ],
  },
  {
    section: "Desktop App",
    pages: [
      { path: "desktop/install", title: "Installation", description: "Install the Proxigo Desktop App on Windows and macOS." },
      { path: "desktop/config", title: "Module configuration", description: "Connect via USB-C and configure your module settings." },
      { path: "desktop/maps", title: "Downloading satellite maps", description: "Pre-load terrain imagery for your flight zone before takeoff." },
    ],
  },
  {
    section: "Flight Controller Integration",
    pages: [
      { path: "fc/ardupilot", title: "ArduPilot setup", description: "Configure ArduPilot to accept VISION_POSITION_ESTIMATE messages from Macula." },
      { path: "fc/px4", title: "PX4 setup", description: "Enable external vision positioning in PX4 firmware." },
      { path: "fc/mavlink", title: "MAVLink message reference", description: "Full reference for MAVLink 2 messages output by the Macula module." },
    ],
  },
  {
    section: "Configuration",
    pages: [
      { path: "config/camera", title: "Camera calibration", description: "Calibrate the downward camera for your operating altitude and terrain type." },
      { path: "config/pipeline", title: "Vision pipeline settings", description: "Tune optical flow and terrain-matching parameters for your environment." },
      { path: "config/output", title: "Output rate & format", description: "Configure position estimate output rate, baud rate, and data format." },
    ],
  },
  {
    section: "Troubleshooting",
    pages: [
      { path: "troubleshoot/no-fix", title: "No position fix", description: "Diagnose and resolve failure to acquire a position estimate." },
      { path: "troubleshoot/drift", title: "Position drift", description: "Identify and correct slow position drift during stationary hold or flight." },
      { path: "troubleshoot/usb", title: "USB connection issues", description: "Fix connection problems between the Desktop App and your module." },
    ],
  },
  {
    section: "API Reference",
    pages: [
      { path: "api/usage", title: "Usage reporting API", description: "Report km² consumed from the Desktop App to the Proxigo cloud." },
      { path: "api/module", title: "Module REST API", description: "Query status and configure the module directly via its onboard REST API." },
      { path: "api/webhooks", title: "Webhooks", description: "Receive real-time Proxigo events pushed to your own backend." },
    ],
  },
];

export function findDocPage(slug: string[]): DocPage | undefined {
  const path = slug.join("/");
  return DOCS_NAV.flatMap((s) => s.pages).find((p) => p.path === path);
}
