package io.github;

public class EsgClassificationResult {
    private boolean isEsg;
    private String impact;

    public EsgClassificationResult() {
    }

    public boolean isEsg() {
        return isEsg;
    }

    public void setEsg(boolean esg) {
        isEsg = esg;
    }

    public String getImpact() {
        return impact;
    }

    public void setImpact(String impact) {
        this.impact = impact;
    }
}
