---
layout: post
title: "Bayesian vs. Frequentist A/B Experimentation"
---

A/B experimentation is a methodology used by tech companies to evaluate product changes. In A/B experiments, users (or any other unit of randomization) are split into two groups. Group A receives the standard product experience (control), while group B receives a new experience (treatment). The team then applies statistics to determine which user experience is superior.

There are two widely used statistical models for measuring A/B experiment success: frequentist and Bayesian. The prevailing model is frequentist, while Bayesian is gaining in popularity.

## Setting up the Experiment

A/B experiments typically start from pursuing a business goal (e.g. improve search result relevancy, increase user engagement, etc.). Corresponding business metrics are picked (e.g. click-thru-rate, user time spent, etc.) to measure impact. The engineering team will then implement an experiment which is predicted to achieve the goal. The experiment is then deployed to the treatment group. Afterwards, the metrics are collected, statistics are applied, and a decision is made on whether to launch the experiment.

## Frequentist Methodology

In the frequentist model, two hypotheses are formed:

- Null hypothesis: there is no difference between the two variants
- Alternative hypothesis: variant B is improved over variant A

As the experiment is deployed and runs to duration, the metrics are collected for each variant. The metrics are first validated for biases (instrumentation error, external conditions, selection bias, sample ratio mismatch). Then, the treatment metrics are compared to the control to measure impact.

If an improvement is found (e.g. group B observed 10% higher conversion rate than group A), the p-value is checked for statistical significance. The p-value is calculated as the conditional probability for the observed metric difference given the null hypothesis is true. If the p-value is lower than the significance level threshold (typically 0.05), then the null hypothesis is rejected and the experiment can be launched.

## Bayesian Methodology

In the Bayesian model, each variant's metric is believed to have likelihoods to be a value mapped to a probability distribution. A [conjugate prior](https://en.wikipedia.org/wiki/Conjugate_prior) is then selected (commonly the Beta distribution). As the experiment runs, more metrics are collected and the distribution is updated.

For each variant, the following metrics are calculated:

- Probability of being best: probability a variant is better than the other
- Expected loss: the loss that results in choosing the wrong variant

The experiment decision is made once a lift in metrics is observed, and the expected losses are below a threshold. These thresholds are set based on the team's preference for speed vs. accuracy. A lower loss threshold is more accurate but will take a longer duration to reach, while a higher loss threshold will allow the team to make a decision quickly with more risk of loss.
