import { createServiceClient } from "@/lib/supabase/service";
import { getUserFromRequest } from "@/lib/supabase/bearer";
import { NextResponse } from "next/server";

async function getAuthUser(req: Request) {
  return getUserFromRequest(req);
}

async function getMembership(svc: ReturnType<typeof createServiceClient>, userId: string) {
  const { data } = await svc
    .from("org_members")
    .select("org_id, role")
    .eq("user_id", userId)
    .limit(1)
    .maybeSingle();
  return data;
}

/** GET — list all org map regions for the caller's org */
export async function GET(req: Request) {
  const user = await getAuthUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const svc = createServiceClient();
  const membership = await getMembership(svc, user.id);
  if (!membership) return NextResponse.json({ error: "Not a member of any org" }, { status: 403 });

  const { data, error } = await svc
    .from("org_map_regions")
    .select("*")
    .eq("org_id", membership.org_id)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

/** POST — publish a local map region to the org */
export async function POST(req: Request) {
  const user = await getAuthUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const svc = createServiceClient();
  const membership = await getMembership(svc, user.id);
  if (!membership) return NextResponse.json({ error: "Not a member of any org" }, { status: 403 });

  const body = await req.json() as {
    name?: string;
    lat_min?: number; lat_max?: number;
    lon_min?: number; lon_max?: number;
    zoom?: number;
    source?: string;
    location_label?: string;
  };

  if (!body.name || body.lat_min == null || body.lat_max == null || body.lon_min == null || body.lon_max == null || body.zoom == null) {
    return NextResponse.json({ error: "name, bbox, and zoom are required" }, { status: 400 });
  }

  const { data, error } = await svc
    .from("org_map_regions")
    .insert({
      org_id:         membership.org_id,
      created_by:     user.id,
      name:           body.name,
      lat_min:        body.lat_min,
      lat_max:        body.lat_max,
      lon_min:        body.lon_min,
      lon_max:        body.lon_max,
      zoom:           body.zoom,
      source:         body.source ?? null,
      location_label: body.location_label ?? null,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

/** DELETE — remove an org map region (creator or org admin only) */
export async function DELETE(req: Request) {
  const user = await getAuthUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await req.json() as { id?: string };
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const svc = createServiceClient();
  const membership = await getMembership(svc, user.id);
  if (!membership) return NextResponse.json({ error: "Not a member of any org" }, { status: 403 });

  const { data: region } = await svc
    .from("org_map_regions")
    .select("created_by, org_id")
    .eq("id", id)
    .single();

  if (!region) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (region.org_id !== membership.org_id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  if (region.created_by !== user.id && membership.role !== "admin") {
    return NextResponse.json({ error: "Only the creator or an org admin can remove this map" }, { status: 403 });
  }

  const { error } = await svc.from("org_map_regions").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
