export interface Service {
  _id: string;
  title: string;
  category: string;
  image?: string;
  description: string;
  basePrice: number;
  estimatedDuration: string;
  serviceArea: string;
  serviceMode: string;
  technicianName: string;
  technicianEmail?: string;
  isAvailable: boolean;
  approvalStatus: "pending" | "accepted" | "cancelled";

  // Re-Approval System
  hasPendingUpdate?: boolean;
  pendingUpdates?: Partial<Service>;
}

// Post Service
export const Postservice = async (data: object) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/services`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  return res.json();
};

// Get Service By Email
export const getService = async ({
  email,
}: {
  email: string;
}): Promise<Service[]> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/services/${encodeURIComponent(email)}`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch services");
  }

  return res.json();
};

// Get All Services
export const getallServices = async () => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/services`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch services");
  }

  return res.json();
};

// Get Service Details
export const ServiceDatails = async ({ id }: { id: string }) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/service/${id}`
  );

  return res.json();
};
//customer
export const BookingPost = async ({ data }: { data: object }) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/booking`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    const result = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message: result.message || "Booking failed",
      };
    }

    return result;
  } catch (error) {
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
};

//customer
export const getBookingEmail = async ({ email }: { email: string }) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/booking/${encodeURIComponent(email)}`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch booking data");
  }

  return res.json();
};
//customer
export const BookingDelete = async ({ id }: { id: string }) => {
  const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/bookingDelete/${id}`;

  console.log("Delete URL:", url);

  const res = await fetch(url, {
    method: "DELETE",
  });

  const text = await res.text();

  console.log("Response Status:", res.status);
  console.log("Response:", text);

  if (!res.ok) {
    throw new Error(text || "Failed to delete booking");
  }

  return text ? JSON.parse(text) : {};
};

//technician
export const getTechnicianBookings = async ({
  email,
}: {
  email: string;
}) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/technician-bookings/${encodeURIComponent(email)}`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch technician bookings");
  }

  return res.json();
};

//edit-service
export const UpdateService = async ({
  id,
  data,
}: {
  id: string;
  data: Record<string, unknown>;
}) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/service/${id}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  if (!res.ok) {
    throw new Error("Failed to update service");
  }

  return await res.json();
};
//technician
export const serviceDelete = async ({ id }: { id: string }) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/serviceDelete/${id}`,
    {
      method: "DELETE",
    }
  );

  const data = await res.json();

  if (!res.ok) {
    console.log("Delete API Error:", data);
    throw new Error(data.message || "Failed to delete service");
  }

  return data;
};
export const AllUser=async()=>{
  const res=await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/user`)
  return res.json()
}
//admin
export const updateUserRole = async ({
  id,
  role,
}: {
  id: string;
  role: "admin" | "customer" | "technician";
}) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/user/${id}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ role }),
    }
  );

  if (!res.ok) {
    throw new Error("Failed to update user role");
  }

  return res.json();
};
export const deleteUser = async ({ id }: { id: string }) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/users/${id}`,
    {
      method: "DELETE",
    }
  );

  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || "Failed to delete user");
  }

  return res.json();
};

///technician
export const UpdateBookingStatus = async ({
  id,
  status,
  finalAmount,
}: {
  id: string;
  status?: string;
  finalAmount?: number;
}) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/booking-status/${id}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...(status !== undefined && { status }),
        ...(finalAmount !== undefined && { finalAmount }),
      }),
    }
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to update booking");
  }

  return data;
};
// Update Service Status
export const UpdateServiceStatus = async ({
  id,
  approvalStatus,
}: {
  id: string;
 approvalStatus: "pending" | "accepted" | "cancelled";
}) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/service-status/${id}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ approvalStatus }),
    }
  );

  const text = await res.text();

  console.log("Response Status:", res.status);
  console.log("Response Body:", text);

  const data = text ? JSON.parse(text) : {};

  if (!res.ok) {
    throw new Error(data.message || `Request failed: ${res.status}`);
  }

  return data;
};
// Get All Bookings (Admin)
export const getAllBookings = async () => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/booking`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch bookings");
  }

  return res.json();
};
// ================= SERVICE RE-APPROVAL API =================

// ================= SERVICE RE-APPROVAL API =================

// Get Pending Service Updates (Admin)
export const getPendingServiceUpdates = async (): Promise<Service[]> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/pending-service-updates`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch pending service updates");
  }

  return res.json();
};

// Admin Approve / Reject Service Update
export const reviewServiceUpdate = async ({
  id,
  action,
}: {
  id: string;
  action: "approve" | "reject";
}) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/service-update-review/${id}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ action }),
    }
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to review service update");
  }

  return data;
};