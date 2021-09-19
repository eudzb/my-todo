import {Component, OnInit} from '@angular/core';
import {Todo} from '../../models/Todo';
import {Category} from '../../models/interfaces/Category';

const colorTravail = '#6bedaf';
const colorEcole = '#0476bb';
const colorCcym = '#FDF1A4';
const colorPerso = '#F87373';
const colorAutre = '#E9E9E9';

interface CategoryProgression {
  progression: string;
  categoryLabel: string;
  total: number;
  color?: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  today: Date = new Date();
  todos: Todo[];
  newTodo: string | null = null;
  progression: string | null;
  selectedCategory: Category = {label: 'Travail', color: colorTravail};
  categories: Category[] = [
    {label: 'Travail', color: colorTravail},
    {label: 'École', color: colorEcole},
    {label: 'CCYM', color: colorCcym},
    {label: 'Perso', color: colorPerso},
    {label: 'Autre', color: colorAutre},
  ];
  progressionCategories: CategoryProgression[];

  constructor() {
  }

  ngOnInit(): void {
    this.initTodos();
    this.initProgressionCategories();
  }

  private initTodos() {
    if (localStorage.getItem('todos') !== null) {
      this.todos = JSON.parse(localStorage.getItem('todos'));
    } else {
      this.todos = [];
      localStorage.setItem('todos', JSON.stringify(this.todos));
    }
  }

  private initProgressionCategories() {
    if (localStorage.getItem('progressionCategories') !== null) {
      this.progressionCategories = JSON.parse(localStorage.getItem('progressionCategories'));
    } else {
      this.setProgressionCategories();
    }
    this.progressionCategories.forEach(el => this.changeProgression(el));
  }

  private setProgressionCategories() {
    this.progressionCategories = [
      {categoryLabel: 'Travail', progression: '0', total: 0, color: colorTravail},
      {categoryLabel: 'École', progression: '0', total: 0, color: colorEcole},
      {categoryLabel: 'CCYM', progression: '0', total: 0, color: colorCcym},
      {categoryLabel: 'Perso', progression: '0', total: 0, color: colorPerso},
      {categoryLabel: 'Autre', progression: '0', total: 0, color: colorAutre},
    ];
    localStorage.setItem('progressionCategories', JSON.stringify(this.progressionCategories));
  }

  onAdd() {
    const found = this.todos.find(el => el.text === this.newTodo);
    if (!this.newTodo || this.newTodo.trim() === '' || found) {
      return;
    }
    const todo = new Todo();
    todo.text = this.newTodo;
    todo.category = this.selectedCategory;
    todo.checked = false;

    this.todos.push(todo);
    localStorage.setItem('todos', JSON.stringify(this.todos));
    const categoryConcerned = this.progressionCategories.find(el => el.categoryLabel === todo.category.label);
    categoryConcerned.total++;
    this.changeProgression(categoryConcerned);
    localStorage.setItem('progressionCategories', JSON.stringify(this.progressionCategories));
    this.newTodo = null;
  }

  onCheck(todo: Todo) {
    todo.checked = !todo.checked;
    localStorage.setItem('todos', JSON.stringify(this.todos));
    const categoryConcerned = this.progressionCategories.find(el => el.categoryLabel === todo.category.label);
    this.changeProgression(categoryConcerned);
  }

  onRemove(ev, todo: Todo) {
    ev.preventDefault();
    this.todos = this.todos.filter(el => el !== todo);
    localStorage.setItem('todos', JSON.stringify(this.todos));
    const categoryConcerned = this.progressionCategories.find(el => el.categoryLabel === todo.category.label);
    categoryConcerned.total--;
    this.changeProgression(categoryConcerned);
  }

  changeProgression(categoryProgression: CategoryProgression) {
    const todosConcerned = this.todos.filter(todo => todo.category.label === categoryProgression.categoryLabel);
    const nbTodosConcerned = todosConcerned.filter(todo => todo.checked).length;
    categoryProgression.progression = `${Math.round((nbTodosConcerned / categoryProgression.total) * 100).toFixed(0)}%`;
    localStorage.setItem('progressionCategories', JSON.stringify(this.progressionCategories));
  }

  onReset() {
    this.todos = [];
    localStorage.setItem('todos', JSON.stringify(this.todos));
    this.setProgressionCategories();
  }
}
