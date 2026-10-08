import { maintenanceState } from "@/lib/maintenance-state";
export async function GET() {
  try {
    return Response.json({ maintenance: (await maintenanceState()).enabled }, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch {
    return Response.json({ maintenance: true }, {
      status: 503, headers: { "Cache-Control": "no-store" },
    });
  }
}
