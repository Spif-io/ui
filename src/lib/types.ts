/**
 * Normalized vehicle shape consumed by VehicleCard and other display components.
 *
 * This is a UI-facing DTO, NOT the raw database row. Consuming sites map their
 * DB/API vehicle types into this shape once (typically via a `toCardVehicle`
 * helper) and keep the rendering components free of source-schema assumptions.
 *
 * camelCase is intentional. The DB uses snake_case; the UI uses camelCase.
 */
export interface CardVehicle {
  id: string;
  year: number;
  make: string;
  model: string;
  trim?: string | null;
  price: number | null;
  mileage: number | null;
  exteriorColor?: string | null;
  bodyStyle?: string | null;
  transmission?: string | null;
  drivetrain?: string | null;
  fuelType?: string | null;
  condition?: 'new' | 'used' | 'certified' | string | null;
  featured?: boolean;
  stockNumber?: string;
  imageUrl?: string | null;
  fallbackImageUrl?: string | null;
  availability?: string | null;
}
