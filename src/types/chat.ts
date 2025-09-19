export interface Message {
  role: "user" | "assistant";
  content: string;
  createdAt: Date;
  events?: Array<{
    id: string;
    title: string;
    location: string;
    date: string;
    time: string;
    provider: string;
    imageUrl?: string;
    price: {
      type: "free" | "paid";
      amount?: number;
    };
  }>;
}
