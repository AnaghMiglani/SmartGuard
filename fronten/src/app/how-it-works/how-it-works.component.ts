// how-it-works/how-it-works.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarkdownModule } from 'ngx-markdown';

@Component({
  selector: 'app-how-it-works',
  standalone: true,
  imports: [CommonModule, MarkdownModule],
  template: `
    <div class="how-it-works-container">
      <h2>How Smart Guard Works</h2>
      <div class="markdown-content">
        <markdown [data]="markdownContent"></markdown>
      </div>
    </div>
  `,
  styles: [`
    .how-it-works-container {
      max-width: 800px;
    }

    h2 {
      color: #ffffff;
      margin-bottom: 1.5rem;
    }

    .markdown-content {
      background-color: #2c2c2c;
      border-radius: 6px;
      padding: 1.5rem;
    }

    /* Additional styles for markdown content */
    ::ng-deep .markdown-content h1,
    ::ng-deep .markdown-content h2,
    ::ng-deep .markdown-content h3,
    ::ng-deep .markdown-content h4 {
      color: #ffffff;
      margin-top: 1.5rem;
      margin-bottom: 0.75rem;
    }

    ::ng-deep .markdown-content p {
      margin-bottom: 1rem;
      line-height: 1.6;
    }

    ::ng-deep .markdown-content code {
      background-color: #3c3c3c;
      padding: 0.2rem 0.4rem;
      border-radius: 3px;
      font-family: monospace;
    }

    ::ng-deep .markdown-content pre {
      background-color: #3c3c3c;
      padding: 1rem;
      border-radius: 4px;
      overflow-x: auto;
    }

    ::ng-deep .markdown-content ul,
    ::ng-deep .markdown-content ol {
      padding-left: 2rem;
      margin-bottom: 1rem;
    }

    ::ng-deep .markdown-content a {
      color: #007acc;
      text-decoration: none;
    }

    ::ng-deep .markdown-content a:hover {
      text-decoration: underline;
    }
  `]
})
export class HowItWorksComponent {
  markdownContent = `
# Smart Guard Text Analysis

## Overview

Smart Guard uses advanced natural language processing techniques to analyze text and provide insights.

### Key Features

- **Sentiment Analysis**: Determines if text has positive, negative, or neutral sentiment
- **Entity Recognition**: Identifies people, organizations, locations, and other entities
- **Content Summarization**: Creates concise summaries of longer texts
- **Intent Detection**: Understands the purpose behind text communications

## How to Use

1. Navigate to the **Analyze** tab
2. Enter or paste your text into the input field
3. Click the **Analyze** button
4. Review the comprehensive analysis results

## Technology

Smart Guard is built using:

- Advanced machine learning models
- Natural language understanding pipelines
- Contextual semantic analysis
- Named entity recognition systems

## Privacy & Security

All data submitted to Smart Guard is:
- Processed securely
- Not stored permanently
- Never shared with third parties
  `;
}
