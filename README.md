JEDI Code Compliance System

The JEDI Code Compliance System is an AI auditing framework designed to evaluate machine learning models for ethical compliance, fairness, transparency, and reliability.

JEDI stands for:

J – Justice

E – Ethics

D – Diversity

I – Integrity

The system allows users to audit machine learning models by analyzing fairness metrics, generating explainability insights, detecting bias, and producing compliance reports.

It is domain-agnostic, meaning it can audit AI systems used in:

- Hiring systems

- Healthcare diagnosis models

- Financial risk prediction

- Criminal justice algorithms

- Loan approval systems

- Any machine learning decision system

Features:

1. Dataset Auditing

- Upload datasets in CSV format

- Automatic dataset preview

- Configure target variable

- Configure sensitive attributes

Example sensitive attributes:

- Gender

- Race

- Age group

- Location

2. Model Evaluation

The framework trains baseline machine learning models directly inside the system.

Supported models:

- Logistic Regression

- Random Forest

- Decision Tree

These models are used to evaluate fairness and bias in predictions.

3. Fairness Testing

The system evaluates models using standardized AI fairness metrics.

Demographic Parity

Measures whether prediction rates are similar across demographic groups.

DP_diff = | P(ŷ = 1 | group A) − P(ŷ = 1 | group B) |

Large differences indicate potential bias.

4. Equal Opportunity

Ensures equal true positive rates across groups.

TPR = TP / (TP + FN)

EO_diff = | TPR_A − TPR_B |

A high difference means the model may disadvantage certain groups.

5. Calibration

Checks whether predicted probabilities match real outcomes.

Metric used:

- Brier Score

- Calibration_diff = | Brier_A − Brier_B |

Poor calibration indicates unreliable predictions.

6. Explainable AI

The system integrates SHAP (SHapley Additive Explanations) to interpret model decisions.

Global Feature Importance

Example output:

Feature	Importance
Feature 1	0.30
Feature 2	0.25
Feature 3	0.18
Sensitive Attribute	0.12

High importance of sensitive attributes may indicate algorithmic bias.

7. Individual Prediction Explanation

Example:

Prediction: Positive

Top Contributing Factors:

Feature A → +0.32
Feature B → +0.15
Sensitive Attribute → −0.20

This enables transparent auditing of AI decisions.

8. Individual Prediction Explanation

Example:

Prediction: Positive

Top Contributing Factors:

Feature A → +0.32
Feature B → +0.15
Sensitive Attribute → −0.20

This enables transparent auditing of AI decisions.

9. Ethical Scorecard

The system generates a visual compliance scorecard.

Ethical Test	Result
Demographic Parity	 Pass
Equal Opportunity	 Warning
Calibration	         Pass
Transparency	     Pass

Overall Status:

Conditionally Compliant