-- CreateEnum
CREATE TYPE "MoshPlane" AS ENUM ('MENTAL', 'SPIRITUAL', 'PHYSICAL');

-- CreateEnum
CREATE TYPE "MoshLifeArea" AS ENUM ('MENTAL', 'SPIRITUAL', 'PHYSICAL', 'BUSINESS', 'IMPACT');

-- CreateEnum
CREATE TYPE "MoshOfferTier" AS ENUM ('ATTRACTION', 'CORE', 'PREMIUM');

-- CreateEnum
CREATE TYPE "MoshEclipsePhase" AS ENUM ('FOUNDATION_IN_FLOW', 'CORE_OFFER_BIRTH', 'VISIBILITY_EXPANSION', 'MONEY_MODEL_ARCHITECTURE', 'MAGNETIC_AUTHORITY');

-- CreateEnum
CREATE TYPE "MoshPattern" AS ENUM ('LIMITING_BELIEF', 'TRUST_ISSUE', 'FEAR_OF_LOSS', 'PERFECTIONISM', 'INFERIORITY', 'PROCRASTINATION', 'LOW_DRIVE');

-- CreateEnum
CREATE TYPE "MoshLetterKind" AS ENUM ('FUTURE_WISDOM', 'LEGACY_LESSON', 'ADVICE_TO_YOUNGER_SELF');

-- CreateEnum
CREATE TYPE "MoshCoachSource" AS ENUM ('AI', 'RULES');

-- CreateTable
CREATE TABLE "MoshProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "displayName" TEXT,
    "title" TEXT NOT NULL DEFAULT 'Life Coach and Mindset Architect',
    "philosophy" TEXT NOT NULL DEFAULT 'Structure Creates Freedom.',
    "mission" TEXT,
    "currency" TEXT NOT NULL DEFAULT 'GHS',
    "timezone" TEXT NOT NULL DEFAULT 'Africa/Accra',
    "planYear" INTEGER,
    "eclipseStart" DATE,
    "onboardedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MoshProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MoshDailyEntry" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "morningRhythm" BOOLEAN NOT NULL DEFAULT false,
    "exercise" BOOLEAN NOT NULL DEFAULT false,
    "creativeWork" BOOLEAN NOT NULL DEFAULT false,
    "journaling" BOOLEAN NOT NULL DEFAULT false,
    "meditation" BOOLEAN NOT NULL DEFAULT false,
    "contentCreation" BOOLEAN NOT NULL DEFAULT false,
    "trustDelegation" BOOLEAN NOT NULL DEFAULT false,
    "gratitude" TEXT,
    "wins" TEXT,
    "reflection" TEXT,
    "energy" INTEGER,
    "mood" INTEGER,
    "completion" INTEGER NOT NULL DEFAULT 0,
    "alignment" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MoshDailyEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MoshPlaneCheckin" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "plane" "MoshPlane" NOT NULL,
    "attribute" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MoshPlaneCheckin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MoshWeeklyEntry" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "weekStart" DATE NOT NULL,
    "intention" TEXT,
    "review" TEXT,
    "momentum" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MoshWeeklyEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MoshWeeklyGoal" (
    "id" TEXT NOT NULL,
    "weeklyId" TEXT NOT NULL,
    "area" "MoshLifeArea" NOT NULL,
    "goal" TEXT NOT NULL,
    "progress" TEXT,
    "completion" INTEGER NOT NULL DEFAULT 0,
    "position" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MoshWeeklyGoal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MoshMonthlyReview" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "month" DATE NOT NULL,
    "energyGivers" TEXT,
    "energyDrainers" TEXT,
    "proudOf" TEXT,
    "fearsOvercome" TEXT,
    "service" TEXT,
    "structuralImprovement" TEXT,
    "growth" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MoshMonthlyReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MoshMonthlyPillar" (
    "id" TEXT NOT NULL,
    "reviewId" TEXT NOT NULL,
    "area" "MoshLifeArea" NOT NULL,
    "goals" TEXT,
    "achievements" TEXT,
    "lessons" TEXT,
    "score" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MoshMonthlyPillar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MoshYearPlan" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "theme" TEXT,
    "vision" TEXT,
    "northStar" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MoshYearPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MoshQuarter" (
    "id" TEXT NOT NULL,
    "yearPlanId" TEXT NOT NULL,
    "quarter" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "focus" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "goal" TEXT NOT NULL,
    "progress" INTEGER NOT NULL DEFAULT 0,
    "revenueTarget" DECIMAL(14,2),
    "clientTarget" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MoshQuarter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MoshMilestone" (
    "id" TEXT NOT NULL,
    "quarterId" TEXT NOT NULL,
    "monthOffset" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "detail" TEXT,
    "done" BOOLEAN NOT NULL DEFAULT false,
    "dueDate" DATE,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MoshMilestone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MoshOffer" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tier" "MoshOfferTier" NOT NULL,
    "name" TEXT NOT NULL,
    "promise" TEXT,
    "price" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "currency" TEXT NOT NULL DEFAULT 'GHS',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "position" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MoshOffer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MoshOfferMetric" (
    "id" TEXT NOT NULL,
    "offerId" TEXT NOT NULL,
    "month" DATE NOT NULL,
    "revenue" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "leads" INTEGER NOT NULL DEFAULT 0,
    "conversions" INTEGER NOT NULL DEFAULT 0,
    "subscribers" INTEGER NOT NULL DEFAULT 0,
    "downloads" INTEGER NOT NULL DEFAULT 0,
    "students" INTEGER NOT NULL DEFAULT 0,
    "satisfaction" INTEGER,
    "completionRate" INTEGER,
    "clients" INTEGER NOT NULL DEFAULT 0,
    "retention" INTEGER,
    "transformation" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MoshOfferMetric_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MoshFunnelSnapshot" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "visitors" INTEGER NOT NULL DEFAULT 0,
    "leads" INTEGER NOT NULL DEFAULT 0,
    "subscribers" INTEGER NOT NULL DEFAULT 0,
    "customers" INTEGER NOT NULL DEFAULT 0,
    "students" INTEGER NOT NULL DEFAULT 0,
    "mentorship" INTEGER NOT NULL DEFAULT 0,
    "advocates" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MoshFunnelSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MoshEclipseDay" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "day" INTEGER NOT NULL,
    "phase" "MoshEclipsePhase" NOT NULL,
    "focus" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "done" BOOLEAN NOT NULL DEFAULT false,
    "note" TEXT,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MoshEclipseDay_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MoshCoachSession" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "pattern" "MoshPattern" NOT NULL,
    "situation" TEXT NOT NULL,
    "analysis" TEXT NOT NULL,
    "encouragement" TEXT NOT NULL,
    "actions" JSONB NOT NULL DEFAULT '[]',
    "prompts" JSONB NOT NULL DEFAULT '[]',
    "recommendations" JSONB NOT NULL DEFAULT '[]',
    "source" "MoshCoachSource" NOT NULL DEFAULT 'RULES',
    "model" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MoshCoachSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MoshLegacyLetter" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "kind" "MoshLetterKind" NOT NULL DEFAULT 'FUTURE_WISDOM',
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "pinned" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MoshLegacyLetter_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MoshProfile_userId_key" ON "MoshProfile"("userId");

-- CreateIndex
CREATE INDEX "MoshDailyEntry_userId_date_idx" ON "MoshDailyEntry"("userId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "MoshDailyEntry_userId_date_key" ON "MoshDailyEntry"("userId", "date");

-- CreateIndex
CREATE INDEX "MoshPlaneCheckin_userId_plane_date_idx" ON "MoshPlaneCheckin"("userId", "plane", "date");

-- CreateIndex
CREATE UNIQUE INDEX "MoshPlaneCheckin_userId_date_attribute_key" ON "MoshPlaneCheckin"("userId", "date", "attribute");

-- CreateIndex
CREATE INDEX "MoshWeeklyEntry_userId_weekStart_idx" ON "MoshWeeklyEntry"("userId", "weekStart");

-- CreateIndex
CREATE UNIQUE INDEX "MoshWeeklyEntry_userId_weekStart_key" ON "MoshWeeklyEntry"("userId", "weekStart");

-- CreateIndex
CREATE INDEX "MoshWeeklyGoal_weeklyId_area_idx" ON "MoshWeeklyGoal"("weeklyId", "area");

-- CreateIndex
CREATE INDEX "MoshMonthlyReview_userId_month_idx" ON "MoshMonthlyReview"("userId", "month");

-- CreateIndex
CREATE UNIQUE INDEX "MoshMonthlyReview_userId_month_key" ON "MoshMonthlyReview"("userId", "month");

-- CreateIndex
CREATE UNIQUE INDEX "MoshMonthlyPillar_reviewId_area_key" ON "MoshMonthlyPillar"("reviewId", "area");

-- CreateIndex
CREATE UNIQUE INDEX "MoshYearPlan_userId_year_key" ON "MoshYearPlan"("userId", "year");

-- CreateIndex
CREATE UNIQUE INDEX "MoshQuarter_yearPlanId_quarter_key" ON "MoshQuarter"("yearPlanId", "quarter");

-- CreateIndex
CREATE INDEX "MoshMilestone_quarterId_monthOffset_idx" ON "MoshMilestone"("quarterId", "monthOffset");

-- CreateIndex
CREATE INDEX "MoshOffer_userId_tier_idx" ON "MoshOffer"("userId", "tier");

-- CreateIndex
CREATE UNIQUE INDEX "MoshOffer_userId_tier_name_key" ON "MoshOffer"("userId", "tier", "name");

-- CreateIndex
CREATE INDEX "MoshOfferMetric_offerId_month_idx" ON "MoshOfferMetric"("offerId", "month");

-- CreateIndex
CREATE UNIQUE INDEX "MoshOfferMetric_offerId_month_key" ON "MoshOfferMetric"("offerId", "month");

-- CreateIndex
CREATE INDEX "MoshFunnelSnapshot_userId_date_idx" ON "MoshFunnelSnapshot"("userId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "MoshFunnelSnapshot_userId_date_key" ON "MoshFunnelSnapshot"("userId", "date");

-- CreateIndex
CREATE INDEX "MoshEclipseDay_userId_phase_idx" ON "MoshEclipseDay"("userId", "phase");

-- CreateIndex
CREATE UNIQUE INDEX "MoshEclipseDay_userId_day_key" ON "MoshEclipseDay"("userId", "day");

-- CreateIndex
CREATE INDEX "MoshCoachSession_userId_createdAt_idx" ON "MoshCoachSession"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "MoshCoachSession_userId_pattern_idx" ON "MoshCoachSession"("userId", "pattern");

-- CreateIndex
CREATE INDEX "MoshLegacyLetter_userId_createdAt_idx" ON "MoshLegacyLetter"("userId", "createdAt");

-- AddForeignKey
ALTER TABLE "MoshProfile" ADD CONSTRAINT "MoshProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MoshDailyEntry" ADD CONSTRAINT "MoshDailyEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MoshPlaneCheckin" ADD CONSTRAINT "MoshPlaneCheckin_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MoshWeeklyEntry" ADD CONSTRAINT "MoshWeeklyEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MoshWeeklyGoal" ADD CONSTRAINT "MoshWeeklyGoal_weeklyId_fkey" FOREIGN KEY ("weeklyId") REFERENCES "MoshWeeklyEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MoshMonthlyReview" ADD CONSTRAINT "MoshMonthlyReview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MoshMonthlyPillar" ADD CONSTRAINT "MoshMonthlyPillar_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "MoshMonthlyReview"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MoshYearPlan" ADD CONSTRAINT "MoshYearPlan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MoshQuarter" ADD CONSTRAINT "MoshQuarter_yearPlanId_fkey" FOREIGN KEY ("yearPlanId") REFERENCES "MoshYearPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MoshMilestone" ADD CONSTRAINT "MoshMilestone_quarterId_fkey" FOREIGN KEY ("quarterId") REFERENCES "MoshQuarter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MoshOffer" ADD CONSTRAINT "MoshOffer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MoshOfferMetric" ADD CONSTRAINT "MoshOfferMetric_offerId_fkey" FOREIGN KEY ("offerId") REFERENCES "MoshOffer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MoshFunnelSnapshot" ADD CONSTRAINT "MoshFunnelSnapshot_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MoshEclipseDay" ADD CONSTRAINT "MoshEclipseDay_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MoshCoachSession" ADD CONSTRAINT "MoshCoachSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MoshLegacyLetter" ADD CONSTRAINT "MoshLegacyLetter_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
