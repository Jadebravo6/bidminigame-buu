// Fonction pour décoder le payload d'un token JWT
function parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
        atob(base64)
            .split('')
            .map(function (c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            })
            .join('')
    );
    return JSON.parse(jsonPayload);
}

// Fonction pour envoyer les requêtes API
export function sendBonusRequest(bonus, token) {
    const loader = document.getElementById('loader');
    loader.style.display = 'block';

    // Décoder le token et extraire les informations de l'utilisateur
    const decodedToken = parseJwt(token);
    const user = {
        id: decodedToken.id,
        wallet: decodedToken.wallet
    };

    // Première requête POST
    fetch('https://ebid.injolab.com/api/bank/earnings', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            appGame: 'slotsmachine',
            bonus: bonus,
            wallet: `/api/bank/wallets/${user.wallet}`
        })
    })
        .then((response) => response.json())
        .then((data) => {
            const earningId = data.id;

            // Deuxième requête POST
            return fetch(`https://ebid.injolab.com/api/bank/earnings/${earningId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/merge-patch+json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    itApproved: true
                })
            });
        })
        .then((response) => response.json())
        .then((data) => {
            loader.style.display = 'none';
            const modal = document.getElementById('myModal');
            const modalMessage = document.getElementById('modalMessage');
            modalMessage.textContent = `Vous avez gagné ${bonus} bid bonus !!!`;
            modal.style.display = 'block';
        })
        .catch((error) => {
            loader.style.display = 'none';
            console.error('Erreur:', error);
        });
}

// Fermer le modal quand on clique n'importe où en dehors de celui-ci
window.onclick = function (event) {
    const modal = document.getElementById('myModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
};
