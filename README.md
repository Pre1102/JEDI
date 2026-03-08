⚖️ JEDI Code Compliance System
AI Ethical Auditing Framework for Machine Learning Models




The JEDI (Justice, Ethics, Diversity, Integrity) Code Compliance System is an AI auditing framework designed to evaluate machine learning models for ethical compliance, fairness, transparency, and reliability.
The system enables users to upload datasets, train baseline machine learning models, analyze fairness metrics, generate explainability insights, and produce comprehensive AI compliance reports.
The framework is domain-agnostic, meaning it can audit AI systems used in:
Hiring and recruitment systems
Healthcare diagnosis models
Financial risk assessment
Criminal justice / recidivism prediction
Any ML system using structured tabular data

🚀 Features
📊 Dataset Auditing
Upload CSV datasets
Automatic dataset preview
Configure target variable and sensitive attributes

🤖 Model Evaluation
Train baseline ML models directly in the system:
Logistic Regression
Random Forest
Decision Tree
These models are used as baseline predictors for ethical evaluation.

⚖️ Fairness Testing
Evaluate models using standardized ethical metrics:
Demographic Parity
Measures whether prediction outcomes are similar across demographic groups.
DP_diff = |P(ŷ = 1 | group A) − P(ŷ = 1 | group B)|
Large differences may indicate algorithmic bias.

Equal Opportunity
Ensures qualified individuals have equal chances of positive predictions.
TPR = TP / (TP + FN)
EO_diff = |TPR_A − TPR_B|

Calibration
Evaluates the reliability of predicted probabilities.
Metric used: Brier Score
Calibration_diff = |Brier_A − Brier_B|
Poor calibration indicates unreliable predictions.

🔍 Explainable AI Module
The system integrates SHAP (SHapley Additive Explanations) for model transparency.
Global Feature Importance
Shows which features influence model predictions the most.
Example:
Feature
Importance
Feature 1
0.30
Feature 2
0.25
Feature 3
0.18
Sensitive Attribute
0.12

A high contribution from sensitive attributes may indicate potential bias.

Individual Prediction Explanation
Explains the reasoning behind a specific prediction.
Example:
Prediction: Positive
Top Contributing Factors:
Feature A +0.32
Feature B +0.15
Sensitive Attribute -0.20
This allows transparent AI decision auditing.

📊 Ethical Scorecard
The framework produces a visual ethical compliance scorecard summarizing fairness results.
Ethical Test
Result
Demographic Parity
🟢 Pass
Equal Opportunity
🟡 Warning
Calibration
🟢 Pass
Explainability
🟢 Pass

Color Indicators
🟢 Pass
🟡 Warning
🔴 Fail

📉 Bias Detection Report
The system highlights patterns of bias across demographic groups.
Example insight:
Significant differences detected in prediction outcomes between demographic groups, indicating potential algorithmic bias.
Reports include:
fairness comparison charts
statistical summaries
demographic group analysis

💡 Recommendations
To mitigate bias, the framework suggests improvements such as:
balancing the training dataset
removing proxy variables correlated with sensitive attributes
applying fairness-aware training techniques
evaluating alternative models

📑 Compliance Reporting
A complete AI governance report is generated containing:
Dataset summary
Model details
Fairness metrics
Explainability analysis
Bias detection insights
Ethical recommendations
Reports can be exported as:
PDF
JSON
Dashboard view

