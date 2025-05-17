import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { Lead } from "../../leadsSlice"

const leads: Lead[] = [
];

export async function GET() {
  return NextResponse.json(leads);
}

export async function POST(request: Request) {
  const formData = await request.formData();

  const firstName = formData.get('firstName')?.toString() || '';
  const lastName = formData.get('lastName')?.toString() || '';
  const email = formData.get('email')?.toString() || '';
  const country = formData.get('country')?.toString() || '';
  const linkedin = formData.get('linkedin')?.toString() || '';
  const additionalInfo = formData.get('additionalInfo')?.toString() || '';

  const visasStr = formData.get('visas')?.toString() || '[]';
  let visas: string[] = [];
  try {
    visas = JSON.parse(visasStr);
  } catch {
    visas = [];
  }

  const resumeFile = formData.get('resume') as File | null;

  let resumeName = '';
  let resumeSize = 0;

  if (resumeFile) {
    resumeName = resumeFile.name;
    resumeSize = resumeFile.size;

    // Convert file to buffer
    const buffer = Buffer.from(await resumeFile.arrayBuffer());

    // Define save directory path (relative to your project root)
    const saveDir = path.resolve('src/app/', 'resume_files');

    // Ensure directory exists or create it
    await fs.mkdir(saveDir, { recursive: true });

    // Save path for the file (make sure filename is safe!)
    const savePath = path.join(saveDir, resumeName);

    // Write file to disk
    await fs.writeFile(savePath, buffer);
  }

  const newLead: Lead = {
    id: leads.length + 1,
    firstName,
    lastName,
    email,
    country,
    linkedin,
    visas,
    additionalInfo,
    resumeName,
    resumeSize,
    status: "Pending",
    submitted: new Date().toLocaleString(),
  };

  leads.push(newLead);

  return NextResponse.json(newLead, { status: 201 });
}

export async function PATCH(request: Request) {
  const { id, status } = await request.json();
  console.log(id);
  const lead = leads.find(l => l.id === id);
  if (lead) {
    lead.status = status;
    return NextResponse.json(lead);
  }
  return new NextResponse("Lead not found", { status: 404 });
}
