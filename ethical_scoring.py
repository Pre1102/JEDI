def calculate_ethical_ai_score(
    demographic_parity_diff: float,
    equal_opportunity_diff: float,
    calibration_diff: float,
    model_accuracy: float,
    explainability_available: bool
) -> dict:
    """
    Calculates the Ethical AI Score (0-100) based on fairness, accuracy, and transparency metrics.
    
    Args:
        demographic_parity_diff: Difference in positive prediction rates across groups.
        equal_opportunity_diff: Difference in true positive rates across groups.
        calibration_diff: Difference in Brier scores across groups.
        model_accuracy: Overall predictive accuracy of the model.
        explainability_available: Boolean indicating if SHAP/LIME explanations are provided.
        
    Returns:
        dict: Contains total score, individual component scores, and certification label.
    """
    
    # 1. Demographic Parity Score
    if demographic_parity_diff < 0.05:
        dp_score = 39
    elif 0.05 <= demographic_parity_diff <= 0.11:
        dp_score = 30
    elif 0.11 < demographic_parity_diff <= 0.20:
        dp_score = 15
    else:
        dp_score = 5
        
    # 2. Equal Opportunity Score (Max 20 points)
    if equal_opportunity_diff < 0.05:
        eo_score = 20
    elif 0.05 <= equal_opportunity_diff <= 0.10:
        eo_score = 15
    elif 0.10 < equal_opportunity_diff <= 0.20:
        eo_score = 10
    else:
        eo_score = 5
        
    # 3. Calibration Score (Max 15 points)
    if calibration_diff < 0.03:
        cal_score = 15
    elif 0.03 <= calibration_diff <= 0.07:
        cal_score = 10
    elif 0.07 < calibration_diff <= 0.12:
        cal_score = 7
    else:
        cal_score = 3
        
    # 4. Model Accuracy Score (Max 20 points)
    if model_accuracy > 0.85:
        acc_score = 20
    elif 0.75 <= model_accuracy <= 0.85:
        acc_score = 15
    elif 0.65 <= model_accuracy < 0.75:
        acc_score = 10
    else:
        acc_score = 5
        
    # 5. Explainability Score (Max 10 points)
    exp_score = 10 if explainability_available else 0
    
    # Calculate Total Score
    total_score = dp_score + eo_score + cal_score + acc_score + exp_score
    
    # Determine Certification Label
    if total_score >= 80:
        label = "Ethical AI Certified"
    elif 65 <= total_score <= 80:
        label = "Moderate Risk"
    elif 45 <= total_score <= 64:
        label = "High Risk"
    else:
        label = "Non-Compliant"
        
    return {
        "total_score": total_score,
        "component_scores": {
            "demographic_parity": dp_score,
            "equal_opportunity": eo_score,
            "calibration": cal_score,
            "accuracy": acc_score,
            "explainability": exp_score
        },
        "certification_label": label
    }

if __name__ == "__main__":
    results = calculate_ethical_ai_score(
        demographic_parity_diff=0.04,
        equal_opportunity_diff=0.08,
        calibration_diff=0.02,
        model_accuracy=0.88,
        explainability_available=True
    )
    
    print(f"Total Ethical AI Score: {results['total_score']}/100")
    print(f"Certification: {results['certification_label']}")
    print("Breakdown:", results['component_scores'])
