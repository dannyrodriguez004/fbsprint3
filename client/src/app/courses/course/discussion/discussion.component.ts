import { UserService } from './../../../user.service';
import { CoursesService } from './../../courses.service';
import { Discussion, Post } from './../../courses.models';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
  selector: 'app-discussion',
  templateUrl: './discussion.component.html',
  styleUrls: ['./discussion.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DiscussionComponent implements OnInit {


  private subscriptions: Subscription[] = [];

  id;
  title;
  description;
  posts = [];
  isClosed = false;

  replying = false;
  htmlContent = '';

  constructor(
    private route: ActivatedRoute,
    private coursesServices: CoursesService,
    private userServices: UserService,
    ) {}

  @Input('current_course') current_course: string;

  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '15rem',
    minHeight: '5rem',
    placeholder: 'Enter text here...',
    translate: 'no',   
    defaultFontName: 'Arial',
    customClasses: [
      {
        name: "titleText",
        class: "titleText",
        tag: "h1",
      },
    ]
  };

  ngOnInit() {

    
    this.subscriptions.push(this.route.queryParams.subscribe( (params) => {
      if(params.discussion) {
        this.id = params.discussion;
      }
    }));

    this.loadDiscussion();

  }


  pushPost() {
    const post = {
      user_id: this.userServices.user(),
      user_name: "John Doe",
      date: new Date().toUTCString(),
      post:this.htmlContent};
    
    this.subscriptions.push(this.coursesServices.postDiscussionPost(this.current_course, this.id, post).subscribe( (resp) => {
      console.log(resp);
    }));

    this.loadDiscussion();
    
  }

  loadDiscussion() {
    this.replying = false;
    this.htmlContent = '';

    this.subscriptions.push(this.coursesServices.getDiscussionInfo(this.current_course, this.id).subscribe( (resp: {title: any, description:any, isClosed:any}) => {
      this.description = resp.description;
      this.title = resp.title;
      this.isClosed = resp.isClosed;
    }))

    this.subscriptions.push(this.coursesServices.getDiscussionPosts(this.current_course, this.id).subscribe( (resp:[]) => {
      if(resp.length > 0) {
        this.posts = resp;
      }
    }));
  }

  openEditor() {
    this.replying = true;
  }

  closeEditor() {
    this.replying = false;
  }

  isPostEmpty() {
    return this.htmlContent == '';
  }

  ngOnChanges() {
    this.ngOnInit();
  }

}
