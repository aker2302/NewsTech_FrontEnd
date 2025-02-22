import { Component, OnInit } from '@angular/core';
import { ArticleService } from '../article.service';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrl: './articles.component.css',
  animations: [
    trigger('dropIn', [
      state('in', style({ transform: 'translateY(0)', opacity: 1 })),
      transition('void => *', [
        style({ transform: 'translateY(-100%)', opacity: 0 }),
        animate('0.8s ease-in')
      ]),
      transition('* => void', [
        animate('0.8s ease-out', style({ transform: 'translateY(100%)', opacity: 0 }))
      ])
    ])
  ]
})
export class ArticlesComponent implements OnInit{

  articles: any[] = [];
  totalArticles: number = 0;
  pageSize: number = 10;
  currentPage: number = 0;
  keywords: string[] = [];
  errorMessage: string = '';
  isLoading: boolean = false;

  maxKeywordsToShow = 10;

  constructor(private articleService: ArticleService) {}

  ngOnInit(): void {
    this.loadArticles();
  }

  handlSearchResults(response: any): void{
    this.articles =response.articles.map((article: any) => {
      article.showFullDescription = false;
      article.showAllKeywords = false;
      return article;
    });
    this.totalArticles = response.totalArticles;
    this.currentPage = 0; // Reset to the first page on new search
    if(response.keywords){
      this.keywords = response.keywords;
    }else{
      this.keywords = [''];// Store the current search keywords
    }
  }

  loadArticles(): void {
    this.isLoading = true;
    this.errorMessage = '';
    if (this.keywords?.length > 0) {
      this.articleService.searchArticles(this.keywords, this.pageSize, this.currentPage).subscribe(response => {
        this.isLoading = false;
        this.handlSearchResults(response);
      });
    } else {
      this.articleService.getArticles(this.pageSize,this.currentPage).subscribe(response => {
        this.isLoading = false;
        this.handlSearchResults(response);
      });
    }
  }


  paginate(event: any): void {
    this.currentPage = event.pageIndex;
    this.loadArticles();
  }

  onImageError(event: any): void {
    event.target.src = 'https://contenthub-static.grammarly.com/blog/wp-content/uploads/2022/08/BMD-3398-760x400.png';
  }

  toggleKeywords(article: any): void {
    article.showAllKeywords = !article.showAllKeywords;
  }

  getVisibleKeywords(article: any): string[] {
    if(article.keywords?.length>0 && !article.showAllKeywords){
      return article.keywords.slice(0, this.maxKeywordsToShow);
    }else{
      return article.keywords;
    }
  }

  toggleDescription(article: any): void {
      article.showFullDescription = !article.showFullDescription;
  }

  getDescriptionPreview(article: any): string {
    const maxDescriptionLength = 100; 
    if (!article.description) {
      return '';
    }
    return article.showFullDescription || article.description.length <= maxDescriptionLength
      ? article.description
      : article.description.slice(0, maxDescriptionLength) + '...';
  }
}
