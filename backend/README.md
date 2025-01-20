# Getting started

## With Docker Compose

```shell
cd docker
docker-compose up -d
```

## Open in browser

open [localhost:3002](http://localhost:3002)

You should see a screen resembling this one :

![initial-screen.png](./initial-screen.png)

# Test

1. BUG : La route /stats ne répond pas, pourquoi ? rendre le serveur à nouveau fonctionnel.
2. FEAT : Remonter le nombre total de commandes.
3. FEAT : Filtrer le résultat par des dates min et max passées en paramètre. Par défaut, si les paramètres ne sont pas spécifiés, ne pas appliquer le filtre.
4. FEAT : Simuler un temps de latence supplémentaire de 500ms pour chaque requête à la base de données
5. FEAT : Que peut-on faire si les performances se dégradent trop ? expliquer à l'oral.
6. FEAT : Compter le nombre de commandes par statut.
7. FEAT : Remonter le nombre de commandes situées dans un rayon de 200km autour de Marseille ("nearMarseilleCount")
8. FEAT : Remonter le pourcentage de commandes ayant au moins une régularisation.
9. FEAT : Remonter le prix moyen des régularisations positives pour les commandes qui en ont.