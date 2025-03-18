// analyze/analyze.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-analyze',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="analyze-container">
      <h2>Text Analysis</h2>
      <div class="input-section">
        <textarea
          [(ngModel)]="inputText"
          placeholder="Enter text to analyze..."
          class="text-input"
        ></textarea>
        <button (click)="analyzeText()" class="analyze-btn">Analyze</button>
      </div>

      <div *ngIf="analysisResult" class="results-section">
        <h3>Analysis Results</h3>
        <div class="result-content">
          <div class="result-card">
            <h4>Sentiment</h4>
            <div class="sentiment-indicator" [class.positive]="analysisResult.sentiment > 0"
                [class.negative]="analysisResult.sentiment < 0"
                [class.neutral]="analysisResult.sentiment === 0">
              {{getSentimentLabel()}}
            </div>
            <div class="score">Score: {{analysisResult.sentiment.toFixed(2)}}</div>
          </div>

          <div class="result-card">
            <h4>Key Entities</h4>
            <ul class="entity-list">
              <li *ngFor="let entity of analysisResult.entities">
                <span class="entity-name">{{entity.name}}</span>
                <span class="entity-type">{{entity.type}}</span>
              </li>
            </ul>
          </div>

          <div class="result-card">
            <h4>Summary</h4>
            <p>{{analysisResult.summary}}</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .analyze-container {
      max-width: 800px;
    }

    h2 {
      color: #ffffff;
      margin-bottom: 1.5rem;
    }

    .input-section {
      margin-bottom: 2rem;
    }

    .text-input {
      width: 100%;
      height: 150px;
      padding: 0.75rem;
      background-color: #2c2c2c;
      border: 1px solid #444;
      border-radius: 4px;
      color: #e0e0e0;
      font-family: inherit;
      margin-bottom: 1rem;
      resize: vertical;
    }

    .text-input:focus {
      outline: none;
      border-color: #007acc;
      box-shadow: 0 0 0 2px rgba(0, 122, 204, 0.25);
    }

    .analyze-btn {
      padding: 0.75rem 1.5rem;
      background-color: #007acc;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 500;
      transition: background-color 0.2s ease;
    }

    .analyze-btn:hover {
      background-color: #0069b0;
    }

    .results-section {
      border-top: 1px solid #333;
      padding-top: 1.5rem;
    }

    h3 {
      color: #ffffff;
      margin-bottom: 1rem;
    }

    .result-content {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 1rem;
    }

    .result-card {
      background-color: #2c2c2c;
      border-radius: 6px;
      padding: 1rem;
    }

    .result-card h4 {
      color: #ffffff;
      margin-top: 0;
      margin-bottom: 0.75rem;
      font-size: 1rem;
    }

    .sentiment-indicator {
      font-size: 1.25rem;
      font-weight: bold;
      margin-bottom: 0.5rem;
    }

    .positive {
      color: #4caf50;
    }

    .negative {
      color: #f44336;
    }

    .neutral {
      color: #ffb74d;
    }

    .score {
      font-size: 0.875rem;
      color: #b0b0b0;
    }

    .entity-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .entity-list li {
      margin-bottom: 0.5rem;
      display: flex;
      justify-content: space-between;
    }

    .entity-name {
      font-weight: 500;
    }

    .entity-type {
      color: #b0b0b0;
      font-size: 0.875rem;
    }
  `]
})
export class AnalyzeComponent {
  inputText = '';
  analysisResult: any = null;

  analyzeText() {
    if (!this.inputText.trim()) return;

    // Mock analysis result - in a real app, this would come from a service call
    this.analysisResult = {
      sentiment: Math.random() * 2 - 1, // Random value between -1 and 1
      entities: [
        { name: 'Product X', type: 'Product' },
        { name: 'Company Y', type: 'Organization' },
        { name: 'John Doe', type: 'Person' }
      ],
      summary: 'This is a sample analysis of the provided text, highlighting key points and suggesting potential actions based on the content.'
    };
  }

  getSentimentLabel() {
    if (!this.analysisResult) return '';

    if (this.analysisResult.sentiment > 0.3) return 'Positive';
    if (this.analysisResult.sentiment < -0.3) return 'Negative';
    return 'Neutral';
  }
}
