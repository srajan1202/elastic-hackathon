package io.github;

public class ESGReport {

    private String company;
    private int year;
    private Emissions emissions;
    private Energy energy;
    private Water water;
    private Waste waste;

    private Targets targets;

    public String getCompany() {
        return company;
    }

    public void setCompany(String company) {
        this.company = company;
    }

    public int getYear() {
        return year;
    }

    public void setYear(int year) {
        this.year = year;
    }

    public Emissions getEmissions() {
        return emissions;
    }

    public void setEmissions(Emissions emissions) {
        this.emissions = emissions;
    }

    public Energy getEnergy() {
        return energy;
    }

    public void setEnergy(Energy energy) {
        this.energy = energy;
    }

    public Water getWater() {
        return water;
    }

    public void setWater(Water water) {
        this.water = water;
    }

    public Waste getWaste() {
        return waste;
    }

    public void setWaste(Waste waste) {
        this.waste = waste;
    }

    public Targets getTargets() {
        return targets;
    }

    public void setTargets(Targets targets) {
        this.targets = targets;
    }
// --- Nested Classes ---

    public static class Emissions {
        private long scope1;
        private long scope2;
        private long scope3;
        private long total;
        private double intensity;

        public long getScope1() {
            return scope1;
        }

        public void setScope1(long scope1) {
            this.scope1 = scope1;
        }

        public long getScope2() {
            return scope2;
        }

        public void setScope2(long scope2) {
            this.scope2 = scope2;
        }

        public long getScope3() {
            return scope3;
        }

        public void setScope3(long scope3) {
            this.scope3 = scope3;
        }

        public long getTotal() {
            return total;
        }

        public void setTotal(long total) {
            this.total = total;
        }

        public double getIntensity() {
            return intensity;
        }

        public void setIntensity(double intensity) {
            this.intensity = intensity;
        }
// getters and setters
    }

    public static class Energy {
        private long totalMwh;
        private long renewableMwh;
        private long nonrenewableMwh;
        private double renewablePercent;


        public long getTotalMwh() {
            return totalMwh;
        }

        public void setTotalMwh(long totalMwh) {
            this.totalMwh = totalMwh;
        }

        public long getRenewableMwh() {
            return renewableMwh;
        }

        public void setRenewableMwh(long renewableMwh) {
            this.renewableMwh = renewableMwh;
        }

        public long getNonrenewableMwh() {
            return nonrenewableMwh;
        }

        public void setNonrenewableMwh(long nonrenewableMwh) {
            this.nonrenewableMwh = nonrenewableMwh;
        }

        public double getRenewablePercent() {
            return renewablePercent;
        }

        public void setRenewablePercent(double renewablePercent) {
            this.renewablePercent = renewablePercent;
        }
    }

    public static class Water {
        private long withdrawnM3;
        private long consumedM3;
        private double recycledPercent;


        public long getWithdrawnM3() {
            return withdrawnM3;
        }

        public void setWithdrawnM3(long withdrawnM3) {
            this.withdrawnM3 = withdrawnM3;
        }

        public long getConsumedM3() {
            return consumedM3;
        }

        public void setConsumedM3(long consumedM3) {
            this.consumedM3 = consumedM3;
        }

        public double getRecycledPercent() {
            return recycledPercent;
        }

        public void setRecycledPercent(double recycledPercent) {
            this.recycledPercent = recycledPercent;
        }
    }

    public static class Waste {
        private long totalTons;
        private long hazardousTons;
        private long nonhazardousTons;
        private double recycledPercent;
        private double landfillPercent;

        public long getTotalTons() {
            return totalTons;
        }

        public void setTotalTons(long totalTons) {
            this.totalTons = totalTons;
        }

        public long getHazardousTons() {
            return hazardousTons;
        }

        public void setHazardousTons(long hazardousTons) {
            this.hazardousTons = hazardousTons;
        }

        public long getNonhazardousTons() {
            return nonhazardousTons;
        }

        public void setNonhazardousTons(long nonhazardousTons) {
            this.nonhazardousTons = nonhazardousTons;
        }

        public double getRecycledPercent() {
            return recycledPercent;
        }

        public void setRecycledPercent(double recycledPercent) {
            this.recycledPercent = recycledPercent;
        }

        public double getLandfillPercent() {
            return landfillPercent;
        }

        public void setLandfillPercent(double landfillPercent) {
            this.landfillPercent = landfillPercent;
        }


    }

    public static class Targets {
        private int netZeroYear;
        private int baselineYear;
        private double reductionAchievedPercent;


        public int getNetZeroYear() {
            return netZeroYear;
        }

        public void setNetZeroYear(int netZeroYear) {
            this.netZeroYear = netZeroYear;
        }

        public int getBaselineYear() {
            return baselineYear;
        }

        public void setBaselineYear(int baselineYear) {
            this.baselineYear = baselineYear;
        }

        public double getReductionAchievedPercent() {
            return reductionAchievedPercent;
        }

        public void setReductionAchievedPercent(double reductionAchievedPercent) {
            this.reductionAchievedPercent = reductionAchievedPercent;
        }
    }


}

