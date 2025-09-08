export interface AdminComment {
    admin_name: string;
    comment: string;
    status: string;
    timestamp: string;
}

export interface SupportTicketData {
    ticket_id?: number;
    _id?: string;
    name: string;
    email: string;
    message: string;
    created_at?: string;
    updated_at?: string;
    admin_status?: string;
    admin_comments?: AdminComment[];
    admin_updated_at?: string;
}
  
export interface SupportAdminUpdateData {
    submission_id: string;
    admin_name: string;
    admin_status: string;
    admin_comment?: string;
  }