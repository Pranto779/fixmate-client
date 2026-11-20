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
  approvalStatus: "pending" | "approved" | "rejected";
};

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

export const BookingPost=async({data}:{data:object})=>{
  const res =await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/booking`,{
    method:"POST",
    headers:{
   "Content-Type":'application/json'
    },
    body:JSON.stringify(data)
  })
  return res.json()
}
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