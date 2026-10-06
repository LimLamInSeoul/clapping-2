# Clapping Music Trainer

Appli d'entraînement à *Clapping Music* (Steve Reich, 1972) pour Android, inspirée de l'appli iOS.
C'est une application web installable (PWA) : un seul fichier HTML, sans dépendance, qui fonctionne hors ligne une fois installée.

## Fonctionnalités

- Les deux parties synthétisées (Web Audio), partie 1 à gauche, partie 2 à droite en stéréo.
- Vous jouez la partie 2 (décalée) ou la partie 1 (fixe) en tapant le grand pad (ou la barre d'espace).
- Votre partie peut être jouée fort, doucement ou pas du tout par l'appli.
- Score en direct : précision, écart moyen (avance/retard), régularité ; repères vert/jaune/rouge sous chaque frappe.
- Résultats par section (1 à 13) à la fin, avec la section la plus difficile.
- Tempo de 60 à 200 à la noire, 4/6/8/12 répétitions par section, départ à n'importe quelle section, boucle sur une section, décompte.
- Calibration de la latence audio (indispensable en Bluetooth).
- L'écran reste allumé pendant le jeu.

## Installer sur Android

1. Ouvrir l'appli dans Chrome (voir l'adresse GitHub Pages ci-dessous).
2. Menu ⋮ → **Ajouter à l'écran d'accueil** / **Installer l'application**.
3. Elle se lance alors en plein écran, comme une appli native, et marche sans réseau.

### Publication avec GitHub Pages

Le workflow `.github/workflows/pages.yml` publie le site à chaque push.
À activer une fois : **Settings → Pages → Build and deployment → Source : GitHub Actions**.
L'adresse sera `https://<utilisateur>.github.io/clapping-2/`.

### En local

```sh
npx serve .
```

## Fichiers

- `index.html` : toute l'appli (interface, audio, score).
- `manifest.webmanifest`, `sw.js` : installation et mode hors ligne.
- `icons/` : icônes générées par `node tools/make-icons.js`.
