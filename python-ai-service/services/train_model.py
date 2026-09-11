import os
import sys
import re
import pandas as pd
import numpy as np
import joblib
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.metrics import classification_report, accuracy_score, roc_auc_score, f1_score

# Ensure root python-ai-service is in sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


def strip_html_tags(text):
    """Remove HTML tags from a string."""
    if pd.isna(text) or not isinstance(text, str):
        return ""
    return re.sub(r'<[^>]+>', ' ', text).strip()


def train_fake_job_model():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    dataset_path = os.path.join(base_dir, "datasets", "fake_job_postings.csv")

    if not os.path.exists(dataset_path):
        print(f"ERROR: Dataset not found at {dataset_path}")
        print("Please place the fake_job_postings.csv file in the datasets/ directory.")
        sys.exit(1)

    print(f"Loading dataset from {dataset_path}...")
    df = pd.read_csv(dataset_path)
    print(f"Dataset loaded: {df.shape[0]} rows, {df.shape[1]} columns")

    # --- Handle the 'fraudulent' column ---
    # Support both string ('t'/'f') and numeric (1/0) formats
    if df['fraudulent'].dtype == object or df['fraudulent'].dtype.name in ['string', 'str'] or isinstance(df['fraudulent'].iloc[0], str):
        df['fraudulent'] = df['fraudulent'].map({'t': 1, 'f': 0, '1': 1, '0': 0})
        # Drop rows where mapping failed (NaN)
        df = df.dropna(subset=['fraudulent'])
        df['fraudulent'] = df['fraudulent'].astype(int)
    else:
        df['fraudulent'] = df['fraudulent'].astype(int)

    print(f"\nClass distribution:")
    print(f"  Legitimate (0): {(df['fraudulent'] == 0).sum()}")
    print(f"  Fraudulent (1): {(df['fraudulent'] == 1).sum()}")

    # --- Build the full_text feature ---
    # Combine all relevant text columns, stripping HTML tags
    text_columns = ['title', 'company_profile', 'description', 'requirements', 'benefits']

    for col in text_columns:
        if col in df.columns:
            df[col] = df[col].apply(strip_html_tags)
        else:
            df[col] = ""

    # Check if full_text already exists (backward compatibility with generated datasets)
    if 'full_text' not in df.columns:
        df['full_text'] = df[text_columns].fillna('').agg(' '.join, axis=1)
    else:
        df['full_text'] = df['full_text'].fillna('')

    # Clean up whitespace
    df['full_text'] = df['full_text'].str.replace(r'\s+', ' ', regex=True).str.strip()

    # Drop rows with empty text
    df = df[df['full_text'].str.len() > 10]
    print(f"Rows after filtering empty text: {df.shape[0]}")

    # Extract features
    X_text = df['full_text']
    y = df['fraudulent']

    # Vectorize text using TF-IDF
    print("\nVectorizing text with TF-IDF...")
    vectorizer = TfidfVectorizer(
        max_features=5000,
        stop_words='english',
        ngram_range=(1, 2),
        min_df=2,
        max_df=0.95,
        sublinear_tf=True
    )
    X_vectorized = vectorizer.fit_transform(X_text)
    print(f"TF-IDF matrix shape: {X_vectorized.shape}")

    # Train / Test split (stratified to preserve class ratio)
    X_train, X_test, y_train, y_test = train_test_split(
        X_vectorized, y, test_size=0.2, random_state=42, stratify=y
    )
    print(f"\nTrain set: {X_train.shape[0]} samples")
    print(f"Test set:  {X_test.shape[0]} samples")

    # Handle class imbalance using SMOTE oversampling
    try:
        from imblearn.over_sampling import SMOTE
        print("\nApplying SMOTE oversampling to balance classes...")
        smote = SMOTE(random_state=42)
        X_train, y_train = smote.fit_resample(X_train, y_train)
        print(f"After SMOTE - Train set: {X_train.shape[0]} samples")
        print(f"  Legitimate: {(y_train == 0).sum()}, Fraudulent: {(y_train == 1).sum()}")
    except ImportError:
        print("\nWARNING: imbalanced-learn not installed. Using class_weight='balanced' instead.")
        print("Install with: pip install imbalanced-learn")
        # Fall back to class weighting with RandomForest
        from sklearn.ensemble import RandomForestClassifier
        model = RandomForestClassifier(
            n_estimators=200, random_state=42, class_weight='balanced', n_jobs=-1
        )
        model.fit(X_train, y_train)
        _evaluate_and_save(model, vectorizer, X_test, y_test, base_dir)
        return

    # Train Gradient Boosting Classifier
    print("\nTraining Gradient Boosting Classifier...")
    model = GradientBoostingClassifier(
        n_estimators=200,
        learning_rate=0.1,
        max_depth=5,
        random_state=42,
        subsample=0.8,
        min_samples_split=10,
        min_samples_leaf=5
    )
    model.fit(X_train, y_train)

    _evaluate_and_save(model, vectorizer, X_test, y_test, base_dir)


def _evaluate_and_save(model, vectorizer, X_test, y_test, base_dir):
    """Evaluate the model and save artifacts."""
    # Evaluate
    y_pred = model.predict(X_test)
    y_proba = model.predict_proba(X_test)[:, 1]

    accuracy = accuracy_score(y_test, y_pred)
    roc_auc = roc_auc_score(y_test, y_proba)
    f1 = f1_score(y_test, y_pred)

    print(f"\n{'='*50}")
    print(f"       MODEL TRAINING SUMMARY")
    print(f"{'='*50}")
    print(f"  Accuracy:      {accuracy * 100:.2f}%")
    print(f"  ROC-AUC Score: {roc_auc:.4f}")
    print(f"  F1 Score:      {f1:.4f}")
    print(f"{'='*50}")
    print(f"\nDetailed Classification Report:")
    print(classification_report(y_test, y_pred, target_names=['Legitimate', 'Fraudulent']))

    # Save model artifacts
    output_dir = os.path.join(base_dir, "trained_models")
    os.makedirs(output_dir, exist_ok=True)

    model_file = os.path.join(output_dir, "fake_job_detector.joblib")
    vectorizer_file = os.path.join(output_dir, "tfidf_vectorizer.joblib")

    joblib.dump(model, model_file)
    joblib.dump(vectorizer, vectorizer_file)

    print(f"\nModels saved to:")
    print(f"  {model_file}")
    print(f"  {vectorizer_file}")

    return accuracy


if __name__ == "__main__":
    train_fake_job_model()
