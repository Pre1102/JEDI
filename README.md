JEDI Code Compliance System
AI Ethical Auditing Framework
The JEDI Code Compliance System is a domain-agnostic AI auditing framework designed to evaluate machine learning models for ethical compliance, fairness, transparency, and reliability.
The system enables users to upload structured datasets, train baseline ML models, and analyze them using standardized AI fairness metrics and explainability techniques. It generates bias reports, ethical scorecards, and compliance reports to help developers and regulators identify and mitigate algorithmic bias.

Project Goal
Modern AI systems often unintentionally introduce bias against demographic groups.
The JEDI framework provides a transparent auditing pipeline that evaluates AI models across ethical dimensions and generates actionable insights.
The system is designed to work across multiple domains including:
Hiring prediction systems
Healthcare diagnosis models
Criminal justice / recidivism prediction
Any ML model using structured tabular data
No domain-specific configuration is required.


Key Features
Dataset Auditing
Upload CSV datasets
Configure target variable and sensitive attributes
Automatic dataset preprocessing
Model Evaluation
Supports baseline ML models:
Logistic Regression
Random Forest
Decision Tree
Ethical Fairness Testing
The framework evaluates models using standardized fairness metrics:
Demographic Parity
Measures whether prediction outcomes are similar across demographic groups.
DP_diff = |P(ŷ = 1 | group A) − P(ŷ = 1 | group B)|

Equal Opportunity
Ensures qualified individuals have equal prediction chances across groups.
TPR = TP / (TP + FN)
EO_diff = |TPR_A − TPR_B|

Calibration
Evaluates reliability of predicted probabilities using Brier Score.
Calibration_diff = |Brier_A − Brier_B|


Explainability Module
The system integrates SHAP (SHapley Additive Explanations) for model transparency.
Global Feature Importance
Shows the overall influence of each feature on predictions.
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
Displays feature contributions for specific predictions to explain why a decision was made.

Ethical Scorecard
The system generates a visual compliance scorecard summarizing fairness results.
Ethical Test
Result
Demographic Parity
Pass
Equal Opportunity
Warning
Calibration
Pass
Explainability
Pass

Color Indicators:
🟢 Pass
🟡 Warning
🔴 Fail

Bias Detection Report
The framework highlights patterns of detected bias across demographic groups.
Example insight:
Significant differences detected in prediction outcomes between demographic groups, indicating potential algorithmic bias.
The report includes charts, statistical summaries, and fairness comparisons.

Recommendations
To help mitigate bias, the system suggests improvements such as:
Balancing the training dataset
Removing proxy variables correlated with sensitive attributes
Applying fairness-aware training techniques
Evaluating alternative models

Reporting Module
A complete AI compliance report is generated containing:
Dataset summary
Model details
Fairness metrics
Explainability analysis
Bias detection insights
Recommendations
Reports can be exported as:
PDF
JSON
Dashboard view

User Interface
The system provides an AI governance dashboard for auditing workflows.
Technology Stack
Frontend
React
Tailwind CSS
Recharts / Chart.js
Backend
FastAPI
Python ML libraries
SHAP for explainability

UI Workflow
Landing Page
Introduces the JEDI Code Compliance System and its core capabilities.
Dataset Upload
Upload CSV dataset
Select target variable
Choose sensitive attributes
Select model type
Fairness Evaluation Dashboard
Displays:
Demographic parity
Equal opportunity
Calibration metrics
Prediction distribution charts
Explainability Dashboard
Shows:
Feature importance
SHAP plots
Sensitive attribute influence
Bias Report
Highlights bias patterns and improvement suggestions.
Compliance Scorecard
Final ethical evaluation with options to:
Download report
Export results



