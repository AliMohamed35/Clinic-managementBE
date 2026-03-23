import { sequelize } from "../connection.ts";
import User from "./User.model.ts";
import Patient from "./Patient.model.ts";
import Doctor from "./Doctor.model.ts";
import Appointment from "./Appointment.model.ts";

// Define associations

// User - Patient (One-to-One)
User.hasOne(Patient, {
  foreignKey: "user_id",
  as: "patient",
});
Patient.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
});

// User - Doctor (One-to-One)
User.hasOne(Doctor, {
  foreignKey: "user_id",
  as: "doctor",
});
Doctor.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
});

// Patient - Appointments (One-to-Many)
Patient.hasMany(Appointment, {
  foreignKey: "patient_id",
  as: "appointments",
});
Appointment.belongsTo(Patient, {
  foreignKey: "patient_id",
  as: "patient",
});

// Doctor - Appointments (One-to-Many)
Doctor.hasMany(Appointment, {
  foreignKey: "doctor_id",
  as: "doctorAppointments",
});
Appointment.belongsTo(Doctor, {
  foreignKey: "doctor_id",
  as: "doctor",
});

// Sync models with database (optional - use migrations in production)
export const syncModels = async (options?: { force?: boolean; alter?: boolean }) => {
  await sequelize.sync(options);
};

// Export all models
export { User, Patient, Doctor, Appointment };
export { sequelize };
