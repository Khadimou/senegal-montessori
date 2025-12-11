# Configuration du Favicon

Le site utilise maintenant des icônes personnalisées au lieu de celle de Vercel.

## Fichiers créés

- `src/app/icon.svg` - Favicon principal (détecté automatiquement par Next.js)
- `src/app/apple-icon.svg` - Icône pour les appareils Apple (détecté automatiquement)
- `public/favicon.svg` - Version alternative dans le dossier public
- `public/icon.svg` - Version alternative dans le dossier public

## Comment ça fonctionne

Next.js 13+ détecte automatiquement les fichiers suivants dans le dossier `app/` :
- `icon.svg` ou `icon.png` → Favicon principal
- `apple-icon.svg` ou `apple-icon.png` → Icône pour iOS/Apple

Ces fichiers sont automatiquement utilisés sans configuration supplémentaire.

## Compatibilité avec les anciens navigateurs

Si vous souhaitez une compatibilité maximale avec tous les navigateurs (y compris les anciens), vous pouvez créer un fichier `favicon.ico` :

1. **Option 1 : Utiliser un outil en ligne**
   - Allez sur [favicon.io](https://favicon.io/) ou [realfavicongenerator.net](https://realfavicongenerator.net/)
   - Téléchargez le fichier `icon.svg` depuis `src/app/icon.svg`
   - Convertissez-le en `favicon.ico`
   - Placez le fichier `favicon.ico` dans le dossier `public/`

2. **Option 2 : Utiliser ImageMagick** (si installé)
   ```bash
   convert src/app/icon.svg -resize 32x32 public/favicon.ico
   ```

## Vérification

Pour vérifier que le favicon fonctionne :
1. Redémarrez le serveur de développement (`npm run dev`)
2. Ouvrez votre site dans un navigateur
3. Videz le cache du navigateur (Ctrl+Shift+R ou Cmd+Shift+R)
4. L'icône personnalisée devrait apparaître dans l'onglet du navigateur

## Design de l'icône

L'icône actuelle représente :
- Un fond avec dégradé ambre/orange (couleurs du site)
- Une forme géométrique Montessori (cercle et triangle)
- Design simple et reconnaissable

Vous pouvez modifier les fichiers SVG pour personnaliser davantage l'icône selon vos besoins.

