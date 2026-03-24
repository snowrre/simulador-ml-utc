import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('http://localhost:3000/simulador');
  await expect(page).toHaveTitle(/The Tech Hub/);
});

test('run knn classification experiment', async ({ page }) => {
  await page.goto('http://localhost:3000/login');
  
  // Login
  await page.fill('input[type="email"]', 'demo@techhub.com');
  await page.fill('input[type="password"]', 'demo123');
  await page.click('button[type="submit"]');
  
  // Wait for redirect to dashboard
  await page.waitForURL('**/dashboard', { timeout: 10000 });
  
  // Now go to simulador
  await page.goto('http://localhost:3000/simulador');
  
  // Click "Explorar Ejemplos"
  await page.click('#btn-ver-ejemplos', { timeout: 10000 });
  
  // Click "Abrir Proyecto Clasificación"
  await page.click('text=Abrir Proyecto Clasificación', { timeout: 10000 });
  
  // Wait for redirect to dataset
  await page.waitForURL('**/dataset');
  
  // Wait for variables to appear
  await page.waitForSelector('text=species', { timeout: 10000 });
  
  // Select target (first 'Marcar como Y' button)
  await page.click('button:has-text("Marcar como Y")');
  
  // Select feature (first 'Marcar como X' button)
  await page.click('button:has-text("Marcar como X")');
  
  // Proceed to model
  await page.click('text=Ir a Preprocesamiento');
  await page.waitForURL('**/preprocesamiento', { timeout: 10000 });
  await page.click('text=Confirmar y Entrenar');
  
  // Wait for Modelo page
  await page.waitForURL('**/modelo/knn', { timeout: 10000 });
  
  // Ejecutar KNN
  await page.click('text=Ejecutar KNN');
  
  // Verify results appear
  await expect(page.locator('text=Métricas de Rendimiento')).toBeVisible();
});

test('run regression experiment with decision tree', async ({ page }) => {
  await page.goto('http://localhost:3000/simulador');
  
  // Click "Explorar Ejemplos"
  await page.click('#btn-ver-ejemplos', { timeout: 10000 });
  
  // Click "Abrir Proyecto Regresión"
  await page.click('text=Abrir Proyecto Regresión', { timeout: 10000 });
  
  // Wait for variables to appear
  await page.waitForSelector('text=quality_score', { timeout: 10000 });
  
  // Select target
  await page.click('button:has-text("Marcar como Y")');
  
  // Select features
  await page.click('button:has-text("Marcar como X")');
  
  // Proceed
  await page.click('text=Ir a Preprocesamiento');
  await page.click('text=Confirmar y Entrenar');
  
  // Select Decision Tree
  await page.click('text=Decision Tree');
  
  // Run
  await page.click('text=Ejecutar Árbol');
  
  // Verify Regression Metrics (R2 Score)
  await expect(page.locator('text=R² Score')).toBeVisible();
});
