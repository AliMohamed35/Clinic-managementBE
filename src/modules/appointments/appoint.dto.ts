// Input DTO - for API request (patient_id comes from authenticated user)
export interface CreateAppointmentDTO {
    doctor_id: number;
    appointment_date: string;
    appointment_time: string;
    status?: 'Pending' | 'Completed';
}

// Internal DTO - for repository layer (includes patient_id)
export interface CreateAppointmentData {
    patient_id: number;
    doctor_id: number;
    appointment_date: string;
    appointment_time: string;
    status: 'Pending' | 'Completed';
}

// Response DTO - what API returns
export interface AppointmentResponseDTO {
    id: number;
    patient_id: number;
    doctor_id: number;
    appointment_date: string;
    appointment_time: string;
    status: 'Pending' | 'Completed';
}
