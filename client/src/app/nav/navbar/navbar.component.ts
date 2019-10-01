import { MatDialog } from '@angular/material';
import { CourseNav } from './../../courses/courses.models';
import { Subscription } from 'rxjs/internal/Subscription';
import { UserService } from './../../user.service';
import { Component, OnInit } from '@angular/core';
import { CourseDetailEditorComponent } from '../../courses/course/info/course-detail-editor/course-detail-editor.component';
import {NewcourseComponent} from "../newcourse/newcourse.component";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  myCourses: CourseNav[] = []; // the user's courses names and id

  private student_id = '';
  private subscriptions: Subscription[] = [];

  constructor(
    private userServices: UserService,
    private dialog: MatDialog,
  ) {
    this.student_id = this.userServices.user(); // get debug student id
  }

  // Runs whenever this component is loaded
  ngOnInit() {

    this.loadCourses();
  }

  openAddCourseDialog() {
    const dialogRef = this.dialog.open(NewcourseComponent, {
      width: '90%',
      data: {
        name: 'Insert Course Title Here',
        description: 'Enter Course description here'
      }
    });

    this.subscriptions.push(dialogRef.afterClosed().subscribe( (result) => {
      if(result) {
        console.log(result);
      }
    }));
  }

  /**
   * Load courses, id and name, for the current user.
   */
  loadCourses() {
    this.subscriptions.push(this.userServices.getStudentCourses(this.student_id).subscribe( (resp: CourseNav[]) => {
      this.myCourses = resp;
    } ));
  }

  toggleAdmin() {
    this.userServices.ToggleIsAdmin();
  }

  isAdmin() {
    return this.userServices.getIsAdmin();
  }
}
