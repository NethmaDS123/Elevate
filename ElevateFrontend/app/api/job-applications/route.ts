import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

interface JobApplication {
  id: string;
  company: string;
  position: string;
  location: string;
  workType: "remote" | "hybrid" | "onsite";
  salary?: string;
  status:
    | "applied"
    | "phone_screen"
    | "interview_1"
    | "interview_2"
    | "interview_3"
    | "final_round"
    | "offer"
    | "rejected"
    | "ghosted";
  applicationDate: string;
  lastUpdateDate: string;
  notes: string;
  jobUrl?: string;
  contactPerson?: string;
  contactEmail?: string;
  nextStepDate?: string;
  priority: "low" | "medium" | "high";
}

interface UserJobData {
  _id: string; // user email
  applications: JobApplication[];
  lastUpdated: string;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("elevate_db");
    const collection = db.collection<UserJobData>("job_applications");

    const userJobData = await collection.findOne({ _id: email });
    const applications = userJobData?.applications || [];

    return NextResponse.json({
      applications: applications,
      count: applications.length,
    });
  } catch (error) {
    console.error("Error fetching applications:", error);
    return NextResponse.json(
      { error: "Failed to fetch applications" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, application } = body;

    if (!email || !application) {
      return NextResponse.json(
        { error: "Email and application data are required" },
        { status: 400 }
      );
    }

    // Validate required fields
    if (
      !application.company ||
      !application.position ||
      !application.location
    ) {
      return NextResponse.json(
        { error: "Company, position, and location are required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("elevate_db");
    const collection = db.collection<UserJobData>("job_applications");

    // Get current user data
    const userJobData = await collection.findOne({ _id: email });
    const currentApplications = userJobData?.applications || [];

    // Add the new application
    const updatedApplications = [...currentApplications, application];

    // Update or create user document
    await collection.updateOne(
      { _id: email },
      {
        $set: {
          applications: updatedApplications,
          lastUpdated: new Date().toISOString(),
        },
      },
      { upsert: true }
    );

    return NextResponse.json({
      success: true,
      application,
    });
  } catch (error) {
    console.error("Error creating application:", error);
    return NextResponse.json(
      { error: "Failed to create application" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, applicationId, updates } = body;

    if (!email || !applicationId || !updates) {
      return NextResponse.json(
        { error: "Email, applicationId, and updates are required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("elevate_db");
    const collection = db.collection<UserJobData>("job_applications");

    // Get current user data
    const userJobData = await collection.findOne({ _id: email });

    if (!userJobData || !userJobData.applications) {
      return NextResponse.json(
        { error: "No applications found for this user" },
        { status: 404 }
      );
    }

    // Find and update the application
    const applicationIndex = userJobData.applications.findIndex(
      (app) => app.id === applicationId
    );

    if (applicationIndex === -1) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    // Update the application
    const updatedApplications = [...userJobData.applications];
    updatedApplications[applicationIndex] = {
      ...updatedApplications[applicationIndex],
      ...updates,
      lastUpdateDate: new Date().toISOString(),
    };

    // Update the document in MongoDB
    await collection.updateOne(
      { _id: email },
      {
        $set: {
          applications: updatedApplications,
          lastUpdated: new Date().toISOString(),
        },
      }
    );

    return NextResponse.json({
      success: true,
      application: updatedApplications[applicationIndex],
    });
  } catch (error) {
    console.error("Error updating application:", error);
    return NextResponse.json(
      { error: "Failed to update application" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, applicationId } = body;

    if (!email || !applicationId) {
      return NextResponse.json(
        { error: "Email and applicationId are required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("elevate_db");
    const collection = db.collection<UserJobData>("job_applications");

    // Get current user data
    const userJobData = await collection.findOne({ _id: email });

    if (!userJobData || !userJobData.applications) {
      return NextResponse.json(
        { error: "No applications found for this user" },
        { status: 404 }
      );
    }

    // Find the application to delete
    const applicationIndex = userJobData.applications.findIndex(
      (app) => app.id === applicationId
    );

    if (applicationIndex === -1) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    // Remove the application
    const updatedApplications = userJobData.applications.filter(
      (app) => app.id !== applicationId
    );

    // Update the document in MongoDB
    await collection.updateOne(
      { _id: email },
      {
        $set: {
          applications: updatedApplications,
          lastUpdated: new Date().toISOString(),
        },
      }
    );

    return NextResponse.json({
      success: true,
      message: "Application deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting application:", error);
    return NextResponse.json(
      { error: "Failed to delete application" },
      { status: 500 }
    );
  }
}
