-- CreateEnum
CREATE TYPE "AbsenceType" AS ENUM ('FERIAS', 'DOENCA', 'COMPENSADO');

-- AlterTable
ALTER TABLE "VacationEntry" ADD COLUMN "type" "AbsenceType" NOT NULL DEFAULT 'FERIAS';
