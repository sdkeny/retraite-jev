/* =====================================================================
   Retraite JEV — Jeunesse Et Vie — logique du site
   Rien à modifier ici : tout se règle dans config.js
   ===================================================================== */
(function () {
  "use strict";

  var C = window.CAMP || {};
  var $  = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  var configured = !!(C.supabaseUrl && C.supabaseAnonKey);
  var LOCAL_KEY = "jev_demo";

  /* ---------------------------------------------------------------
     1. Textes issus de la configuration
     --------------------------------------------------------------- */
  function hydrate() {
    if (C.dateTexte) {
      $$("[data-date-texte]").forEach(function (el) { el.textContent = C.dateTexte; });
    }
    poser("#hero-orga", C.organisation);
    poser("#footer-orga", C.organisation ? C.organisation + " ✦" : "");

    if (C.titre) {
      var t = $(".titre");
      if (t) {
        // « Retraite » / « JEV » : on coupe sur le dernier mot du titre
        var mots = C.titre.trim().split(/\s+/);
        var dernier = mots.pop();
        t.children[0].textContent = mots.join(" ");
        t.children[1].textContent = dernier;
      }
      var ft = $("#footer-titre");
      if (ft) ft.textContent = C.titre + (C.edition ? " — " + C.edition.replace(/^Édition\s*/i, "") : "");
    }

    /* Le lieu */
    var L = C.lieu || {};
    poser("#hero-lieu", L.nom);
    poser("#lieu-nom", L.nom);
    poser("#lieu-adresse", [L.adresse, L.ville].filter(Boolean).join(" · "));
    var carte = $("#lieu-carte");
    if (carte && L.carte) { carte.href = L.carte; carte.hidden = false; }

    /* La cotisation */
    var K = C.cotisation || {};
    poser("#cotisation-montant", K.montant);
    poser("#cotisation-detail", K.detail);
    poser("#cotisation-note", K.note);
    poser("#q-montant", K.montant);

    var pay = $("#cotisation-paiement");
    if (pay) {
      var lignes = [];
      if (K.virement) lignes.push(["Virement", K.virement]);
      if (K.lydia)    lignes.push(["Lydia", K.lydia]);
      if (lignes.length) {
        pay.innerHTML = lignes.map(function (l) {
          return "<div><b>" + escapeHtml(l[0]) + "</b>" + escapeHtml(l[1]) + "</div>";
        }).join("") + (K.titulaire
          ? '<div class="paiement__titulaire">Au nom de ' + escapeHtml(K.titulaire) + "</div>"
          : "");
      } else {
        pay.hidden = true;
      }
    }

    /* L'infoline */
    if (!C.infoline) {
      var cc = $("#card-contact");
      if (cc) cc.hidden = true;
    } else {
      var tel = $("#infoline-lien");
      if (tel) { tel.textContent = C.infoline; tel.href = "tel:" + (C.infolineLien || C.infoline).replace(/\s+/g, ""); }
      var wa = $("#infoline-wa");
      if (wa) wa.href = lienWhatsApp();
    }

    /* Le thème */
    var T = C.theme || {};
    poser("#theme-citation", T.citation);
    poser("#theme-ref", T.reference);
    var texte = $("#theme-texte");
    if (texte && Array.isArray(T.paragraphes)) {
      texte.innerHTML = T.paragraphes.map(function (p) {
        return "<p>" + escapeHtml(p) + "</p>";
      }).join("");
    }

    /* Date limite d'inscription */
    poser("#deadline", C.dateLimite);
  }

  function lienWhatsApp(texte) {
    var num = String(C.infolineLien || C.infoline || "").replace(/[^0-9]/g, "");
    if (!num) return "#";
    return "https://wa.me/" + num + (texte ? "?text=" + encodeURIComponent(texte) : "");
  }

  function poser(sel, valeur) {
    var el = $(sel);
    if (!el) return;
    if (valeur) el.textContent = valeur;
    else el.hidden = true;
  }

  /* ---------------------------------------------------------------
     2. Compte à rebours
     --------------------------------------------------------------- */
  function countdown() {
    var box = $("#countdown");
    if (!box || !C.dateISO) return;
    var cible = new Date(C.dateISO).getTime();
    if (isNaN(cible)) return;

    var cells = {
      j: $('[data-cd="j"]', box), h: $('[data-cd="h"]', box),
      m: $('[data-cd="m"]', box), s: $('[data-cd="s"]', box)
    };
    function pad(n) { return n < 10 ? "0" + n : String(n); }

    function tick() {
      var d = cible - Date.now();
      if (d <= 0) {
        box.classList.add("is-past");
        cells.j.textContent = "0"; cells.h.textContent = "00";
        cells.m.textContent = "00"; cells.s.textContent = "00";
        clearInterval(timer);
        return;
      }
      var s = Math.floor(d / 1000);
      cells.j.textContent = String(Math.floor(s / 86400));
      cells.h.textContent = pad(Math.floor(s % 86400 / 3600));
      cells.m.textContent = pad(Math.floor(s % 3600 / 60));
      cells.s.textContent = pad(s % 60);
    }
    tick();
    var timer = setInterval(tick, 1000);
  }

  /* ---------------------------------------------------------------
     3. Programme
     --------------------------------------------------------------- */
  function programme() {
    var box = $("#timeline");
    if (!box || !Array.isArray(C.programme)) return;

    box.innerHTML = C.programme.map(function (e) {
      var aFaire = /…|\.\.\.|à (compléter|confirmer|définir)/i
                     .test((e.titre || "") + (e.detail || ""));
      var html = '<article class="event' + (aFaire ? " is-todo" : "") + '">';
      if (e.icone)  html += '<div class="event__icone" aria-hidden="true">' + escapeHtml(e.icone) + "</div>";
      if (e.jour)   html += '<p class="event__jour">' + escapeHtml(e.jour) + "</p>";
      if (e.titre)  html += '<h3 class="event__titre">' + escapeHtml(e.titre) + "</h3>";
      if (e.detail) html += '<p class="event__detail">' + escapeHtml(e.detail) + "</p>";
      return html + "</article>";
    }).join("");
  }

  /* ---------------------------------------------------------------
     4. Pied de page
     --------------------------------------------------------------- */
  function footer() {
    var box = $("#footer-infos");
    if (!box) return;
    var items = [];
    var L = C.lieu || {};
    if (L.nom) items.push(["Lieu", escapeHtml(L.nom)]);
    if (C.cotisation && C.cotisation.montant) items.push(["Participation", escapeHtml(C.cotisation.montant)]);
    if (C.infoline) {
      items.push(["Infoline",
        '<a href="tel:' + escapeHtml((C.infolineLien || C.infoline).replace(/\s+/g, "")) + '">' +
        escapeHtml(C.infoline) + "</a>"]);
    }
    if (C.emailContact) {
      items.push(["E-mail",
        '<a href="mailto:' + escapeHtml(C.emailContact) + '">' + escapeHtml(C.emailContact) + "</a>"]);
    }
    box.innerHTML = items.map(function (i) {
      return "<div><b>" + i[0] + "</b>" + i[1] + "</div>";
    }).join("");
  }

  /* ---------------------------------------------------------------
     5. Navigation : lien actif au défilement
     --------------------------------------------------------------- */
  function nav() {
    var liens = $$(".nav a");
    if (!liens.length || !("IntersectionObserver" in window)) return;

    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        liens.forEach(function (a) {
          a.classList.toggle("is-active", a.getAttribute("href") === "#" + en.target.id);
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });

    liens.forEach(function (a) {
      var cible = document.getElementById(a.getAttribute("href").slice(1));
      if (cible) obs.observe(cible);
    });
  }

  /* ---------------------------------------------------------------
     6. Le formulaire
     --------------------------------------------------------------- */

  /* Questions obligatoires */
  var TOUJOURS = ["nom", "sexe", "telephone", "statut", "jours"];

  function estMembre(form) {
    return valeur(form, "statut") === "Membre de JEV";
  }

  function formulaire() {
    var form = $("#camp-form");
    if (!form) return;
    var btn    = $("#submit-btn");
    var erreur = $("#form-error");

    /* affichage conditionnel + effacement des erreurs corrigées */
    form.addEventListener("input",  function (e) { nettoyer(e.target); rafraichir(form); });
    form.addEventListener("change", function (e) { nettoyer(e.target); rafraichir(form); });
    rafraichir(form);

    /* enfants : ajouter / retirer une ligne */
    $("#enfant-ajout").addEventListener("click", function () {
      var ligne = ajouterEnfant();
      ligne.querySelector("input").focus();
    });
    $("#enfants-liste").addEventListener("click", function (e) {
      var b = e.target.closest(".enfant-suppr");
      if (!b) return;
      b.closest(".enfant").remove();
      if (!$$(".enfant", form).length) ajouterEnfant();
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      erreur.hidden = true;

      var manquants = valider(form);
      if (manquants.length) {
        erreur.textContent = manquants.length === 1
          ? "Il reste une question sans réponse."
          : "Il reste " + manquants.length + " questions sans réponse.";
        erreur.hidden = false;
        var premier = form.querySelector('[name="' + manquants[0] + '"]');
        if (premier) {
          premier.scrollIntoView({ block: "center", behavior: "smooth" });
          try { premier.focus({ preventScroll: true }); } catch (_) {}
        }
        return;
      }

      var reponse = {
        nom:          form.nom.value.trim(),
        sexe:         valeur(form, "sexe"),
        telephone:    form.telephone.value.trim(),
        email:        form.email.value.trim() || null,
        ville:        form.ville.value.trim() || null,
        statut:       valeur(form, "statut"),
        invite_par:   estMembre(form) ? null : (form.invite_par.value.trim() || null),
        enfants:      enfants(form),
        jours:        valeurs(form, "jours").join(", "),
        repas:        form.repas.value.trim() || null,
        sujets:       valeurs(form, "sujets").join(", ") || null,
        commissions:  estMembre(form) ? (valeurs(form, "commissions").join(", ") || null) : null,
        message:      form.message.value.trim() || null
      };

      btn.disabled = true;
      btn.textContent = "Envoi en cours…";

      if (!reponse.enfants) delete reponse.enfants;

      envoyer(reponse)
        .then(function () { remercier(reponse); })
        .catch(function (err) {
          console.error("[JEV]", err);
          erreur.textContent =
            "Tes réponses n'ont pas pu être envoyées. Vérifie ta connexion et réessaie" +
            (C.infoline ? ", ou appelle les responsables au " + C.infoline + "." : ".");
          erreur.hidden = false;
          erreur.scrollIntoView({ block: "center", behavior: "smooth" });
        })
        .then(function () {
          btn.disabled = false;
          btn.textContent = "Envoyer mes réponses";
        });
    });

    /* « Inscrire quelqu'un d'autre » */
    $("#again").addEventListener("click", function () {
      form.reset();
      $("#enfants-liste").innerHTML = "";
      $$(".field", form).forEach(function (f) { f.classList.remove("is-invalid"); });
      $$(".err", form).forEach(function (p) { p.textContent = ""; });
      rafraichir(form);
      $("#thanks").hidden = true;
      form.hidden = false;
      form.scrollIntoView({ block: "start", behavior: "smooth" });
    });
  }

  /* Montre ou cache « qui t'a invité(e) ? » et les commissions (membres seulement) */
  function rafraichir(form) {
    var membre = estMembre(form);
    var inv = $("#field-invite-par");
    if (inv) inv.hidden = !valeur(form, "statut") || membre;
    var com = $("#bloc-commissions");
    if (com) com.hidden = !membre;

    var avecEnfants = !!valeur(form, "avec_enfants");
    $("#bloc-enfants").hidden = !avecEnfants;
    if (avecEnfants && !$$(".enfant", form).length) ajouterEnfant();

    var ec = $("#etape-contribution");
    if (ec) ec.textContent = membre ? "4 · Les commissions" : "4 · Un dernier mot";
  }

  /* Une ligne « prénom et nom + âge » pour un enfant */
  function ajouterEnfant() {
    var ligne = document.createElement("div");
    ligne.className = "enfant";
    ligne.innerHTML =
      '<input class="input" type="text" name="enfant_nom" placeholder="Prénom et nom de l'enfant" maxlength="80">' +
      '<input class="input input--court" type="number" name="enfant_age" min="0" max="17" placeholder="Âge">' +
      '<button type="button" class="enfant-suppr" aria-label="Retirer cet enfant">×</button>';
    $("#enfants-liste").appendChild(ligne);
    return ligne;
  }

  /* « Léa Dupont (6 ans) ; Noé Dupont (3 ans) », ou null */
  function enfants(form) {
    if (!valeur(form, "avec_enfants")) return null;
    var liste = $$(".enfant", form).map(function (l) {
      var nom = l.querySelector('[name="enfant_nom"]').value.trim();
      var age = l.querySelector('[name="enfant_age"]').value.trim();
      if (!nom) return "";
      return age ? nom + " (" + age + " ans)" : nom;
    }).filter(Boolean);
    return liste.length ? liste.join(" ; ") : null;
  }

  function valider(form) {
    var manquants = [];
    var aVerifier = TOUJOURS.slice();
    if (valeur(form, "avec_enfants")) aVerifier.push("enfant_nom");

    aVerifier.forEach(function (nom) {
      var ok, message;

      switch (nom) {
        case "nom":
          var mots = form.nom.value.trim().split(/\s+/).filter(Boolean);
          ok = mots.length >= 2;
          message = mots.length === 0
            ? "Merci d'indiquer ton nom et ton prénom."
            : "Merci d'indiquer ton nom également (nom et prénom).";
          break;

        case "telephone":
          var chiffres = (form[nom].value || "").replace(/[^0-9]/g, "");
          ok = chiffres.length >= 8;
          message = chiffres.length
            ? "Ce numéro semble incomplet."
            : "Merci d'indiquer un numéro de téléphone.";
          break;

        case "enfant_nom":
          ok = !!enfants(form);
          message = "Merci d'indiquer le nom d'au moins un enfant.";
          break;

        case "jours":
          ok = valeurs(form, nom).length > 0;
          message = "Merci de cocher au moins un jour.";
          break;

        default:
          ok = !!valeur(form, nom);
          message = "Merci de répondre à cette question.";
      }

      marquer(form, nom, ok, message);
      if (!ok) manquants.push(nom);
    });

    return manquants;
  }

  function marquer(form, nom, ok, message) {
    var champ = form.querySelector('[name="' + nom + '"]');
    if (!champ) return;
    var bloc = champ.closest(".field");
    var p = form.querySelector('[data-err-for="' + nom + '"]');
    if (bloc) bloc.classList.toggle("is-invalid", !ok);
    if (p) p.textContent = ok ? "" : message;
  }

  function nettoyer(el) {
    if (!el || !el.name) return;
    var bloc = el.closest(".field");
    if (bloc) bloc.classList.remove("is-invalid");
    var p = document.querySelector('[data-err-for="' + el.name + '"]');
    if (p) p.textContent = "";
  }

  function valeur(form, nom) {
    var coche = form.querySelector('[name="' + nom + '"]:checked');
    return coche ? coche.value : "";
  }

  function valeurs(form, nom) {
    return $$('[name="' + nom + '"]:checked', form).map(function (el) { return el.value; });
  }

  /* ---------------------------------------------------------------
     7. Envoi vers Supabase (ou stockage local en mode démo)
     --------------------------------------------------------------- */
  function envoyer(reponse) {
    if (!configured) {
      return new Promise(function (resolve) {
        var liste = [];
        try { liste = JSON.parse(localStorage.getItem(LOCAL_KEY) || "[]"); } catch (_) {}
        liste.push(Object.assign({ created_at: new Date().toISOString() }, reponse));
        try { localStorage.setItem(LOCAL_KEY, JSON.stringify(liste)); } catch (_) {}
        console.warn("[JEV] Mode démo — réponse enregistrée localement :", reponse);
        setTimeout(resolve, 550);
      });
    }

    var base = String(C.supabaseUrl).replace(/\/+$/, "");
    return fetch(base + "/rest/v1/inscriptions_jev", {
      method: "POST",
      headers: {
        "apikey": C.supabaseAnonKey,
        "Authorization": "Bearer " + C.supabaseAnonKey,
        "Content-Type": "application/json",
        "Prefer": "return=minimal"
      },
      body: JSON.stringify(reponse)
    }).then(function (r) {
      if (r.ok) return true;
      return r.text().then(function (t) {
        throw new Error("Supabase " + r.status + " : " + t);
      });
    });
  }

  /* ---------------------------------------------------------------
     8. Écran de remerciement
     --------------------------------------------------------------- */
  function remercier(reponse) {
    var prenom = reponse.nom.split(/\s+/)[0];
    var titre = "À très bientôt, " + prenom + " !";
    var texte = "Tes réponses sont bien enregistrées. Rendez-vous " +
                (C.dateTexte ? C.dateTexte.toLowerCase() : "à la retraite") +
                " à " + ((C.lieu && C.lieu.nom) || "Marseille") + ". " +
                "Pense à préparer ton sac : la liste est plus haut, dans « Infos pratiques ».";

    $("#thanks-title").textContent = titre;
    $("#thanks-text").textContent = texte;

    var wa = $("#thanks-wa");
    if (wa && (C.infolineLien || C.infoline)) {
      wa.href = lienWhatsApp("Bonjour, je viens de remplir le questionnaire de la retraite JEV : " + reponse.nom + ".");
      wa.hidden = false;
    }

    $("#camp-form").hidden = true;
    var t = $("#thanks");
    t.hidden = false;
    rejouer(t);
    t.scrollIntoView({ block: "center", behavior: "smooth" });
  }

  /* relance l'animation d'apparition d'un bloc qui était masqué */
  function rejouer(el) {
    var a = el.style.animation;
    el.style.animation = "none";
    void el.offsetWidth;
    el.style.animation = a || "";
  }

  /* ---------------------------------------------------------------
     Utilitaires
     --------------------------------------------------------------- */
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  /* ---------------------------------------------------------------
     Démarrage
     --------------------------------------------------------------- */
  hydrate();
  countdown();
  programme();
  footer();
  nav();
  formulaire();

  if (!configured) {
    var b = $("#demo-banner");
    if (b) b.hidden = false;
  } else {
    try { localStorage.removeItem(LOCAL_KEY); } catch (_) {}
  }
})();
