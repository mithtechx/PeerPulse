public type Doubt = {
  id: string;
  user_id: string;
  title: string;
  subject_code: string;
  description: string;
  image_url?: string;
  is_resolved: boolean;
  forwarded_to_instructor: boolean;
  created_at: string;
};

export type DoubtAnswer = {
  id: string;
  doubt_id: string;
  user_id: string;
  content: string;
  image_url?: string;
  created_at: string;
};

export type Equipment = {
  id: string;
  owner_id: string;
  title: string;
  category: string;
  description: string;
  image_url?: string;
  is_available: boolean;
  borrower_id?: string;
  status: 'available' | 'requested' | 'borrowed';
  created_at: string;
};

export type EquipmentRequest = {
  id: string;
  user_id: string;
  title: string;
  category: string;
  description: string;
  is_fulfilled: boolean;
  created_at: string;
};

export type LostFoundItem = {
  id: string;
  user_id: string;
  type: 'lost' | 'found';
  title: string;
  location: string;
  description: string;
  image_url?: string;
  status: 'open' | 'claimed';
  contact_info: string;
  created_at: string;
};