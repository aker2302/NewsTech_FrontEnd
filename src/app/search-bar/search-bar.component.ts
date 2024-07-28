import { Component, EventEmitter, Output } from '@angular/core';
import { ArticleService } from '../article.service';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.css'
})
export class SearchBarComponent {

  keyword: string = '';
  
  keywords: string[] = [];

  @Output() searchResults = new EventEmitter<any>();

  constructor(private articleService: ArticleService) {}

  addKeyword(): void {
    if (this.keyword.trim() && !this.keywords.includes(this.keyword.trim())) {
      this.keywords.push(this.keyword.trim());
    }
    this.keyword = ''; // Clear the input field
    this.search(); // Trigger search whenever a keyword is added
  }

  removeKeyword(index: number): void {
    this.keywords.splice(index, 1);
    this.search();
  }

  search(pageSize: number = 10, currentPage: number = 0): void {
    if (this.keywords.length > 0) {
      this.articleService.searchArticles(this.keywords, pageSize, currentPage).subscribe(response => {
        // Emit the search results to be used in ArticlesComponent
        this.searchResults.emit({
          articles: response.articles,
          totalArticles: response.totalArticles,
          currentPage: response.currentPage,
          keywords: this.keywords
        });
        console.log(response.currentPage);
        console.log(response.totalArticles);
        console.log(response.keywords);
        console.log(this.keywords);
      });
    } else {
      this.articleService.getArticles(pageSize, currentPage).subscribe(response => {
        // Emit the initial articles if no keywords are present
        this.searchResults.emit({
          articles: response.articles,
          totalArticles: response.totalArticles,
          currentPage: response.currentPage,
          keywords: this.keywords
        });
        console.log(response.currentPage);
        console.log(response.totalArticles);
      });
    }
  }

}
