document.addEventListener("DOMContentLoaded", () => {
    const inputs = {
        agua: document.getElementById("input-agua"),
        vinagre: document.getElementById("input-vinagre"),
        bicarbonato: document.getElementById("input-bicarbonato"),
        temp: document.getElementById("input-temp")
    };

    const ui = {
        totalBox: document.getElementById("total-box"),
        totalStatus: document.getElementById("total-status"),
        liquid: document.getElementById("liquid"),
        bubbles: document.getElementById("bubbles"),
        phValue: document.getElementById("ph-value"),
        phBadge: document.getElementById("ph-badge"),
        btnCalcular: document.getElementById("btn-calcular")
    };

    const table = {
        agua: document.getElementById("tbl-agua"),
        vinagre: document.getElementById("tbl-vinagre"),
        bicarbonato: document.getElementById("tbl-bicarbonato"),
        temp: document.getElementById("tbl-temp"),
        ph: document.getElementById("tbl-ph")
    };

    // Evalúa y valida la suma de los componentes ingresados
    function verificarRestricciones() {
        let agua = parseFloat(inputs.agua.value) || 0;
        let vinagre = parseFloat(inputs.vinagre.value) || 0;
        let bicarbonato = parseFloat(inputs.bicarbonato.value) || 0;

        // Limitar entradas para que no pongan valores negativos accidentalmente
        if (agua < 0) { inputs.agua.value = 0; agua = 0; }
        if (vinagre < 0) { inputs.vinagre.value = 0; vinagre = 0; }
        if (bicarbonato < 0) { inputs.bicarbonato.value = 0; bicarbonato = 0; }

        const sumaTotal = parseFloat((agua + vinagre + bicarbonato).toFixed(2));

        // Tolerancia matemática ultra fina para capturar decimales flotantes (99.99 a 100.01)
        if (Math.abs(sumaTotal - 100) < 0.05) {
            ui.totalBox.className = "total-indicator valid";
            ui.totalStatus.innerText = `✅ Total = 100.0 %`;
            ui.btnCalcular.disabled = false;
        } else {
            ui.totalBox.className = "total-indicator invalid";
            ui.totalStatus.innerText = `❌ Total = ${sumaTotal.toFixed(1)} % (Debe ser 100%)`;
            ui.btnCalcular.disabled = true;
        }

        // Simular volumen físico dinámico del vaso proporcionalmente en tiempo real
        const alturaVaso = Math.min(95, Math.max(15, (agua + vinagre) * 0.8 + (bicarbonato * 0.2)));
        ui.liquid.style.height = `${alturaVaso}%`;
    }

    function calcularResultadosExperimento() {
        const agua = parseFloat(inputs.agua.value) || 0;
        const vinagre = parseFloat(inputs.vinagre.value) || 0;
        const bicarbonato = parseFloat(inputs.bicarbonato.value) || 0;
        const temp = parseFloat(inputs.temp.value) || 25;

        // Modelo matemático estequiométrico en base a proporciones DOE
        const molesAcido = (vinagre / 100) * 0.5;
        const molesBase = (bicarbonato / 100) * 0.4;

        let ph = 7.0;
        const shiftTermico = (temp - 25) * 0.004;

        if (vinagre === 0 && bicarbonato === 0) {
            ph = 7.0 - shiftTermico;
        } else if (molesAcido > molesBase) {
            const excesoAcido = molesAcido - molesBase;
            ph = 2.4 - Math.log10(excesoAcido + 0.01);
        } else if (molesBase > molesAcido) {
            const excesoBase = molesBase - molesAcido;
            ph = 8.3 + Math.log10(excesoBase + 0.01) - shiftTermico;
        } else {
            ph = 7.0 - shiftTermico; // Punto de equivalencia química perfecta
        }

        ph = Math.max(1.5, Math.min(12.5, ph));

        // Actualizar Pantalla Digital del Instrumento
        ui.phValue.innerText = ph.toFixed(2);

        // Actualizar badges e indicadores de colores
        ui.phBadge.className = "ph-badge";
        if (ph < 6.5) {
            ui.phBadge.innerText = "Ácido";
            ui.phBadge.classList.add("badge-acido");
            ui.liquid.style.backgroundColor = "rgba(229, 62, 62, 0.6)";
        } else if (ph > 7.5) {
            ui.phBadge.innerText = "Base";
            ui.phBadge.classList.add("badge-base");
            ui.liquid.style.backgroundColor = "rgba(49, 130, 206, 0.6)";
        } else {
            ui.phBadge.innerText = "Neutro";
            ui.phBadge.classList.add("badge-neutro");
            ui.liquid.style.backgroundColor = "rgba(72, 187, 120, 0.6)";
        }

        // Efecto visual transitorio de reacción química (burbujeo de CO2)
        if (vinagre > 1 && bicarbonato > 1) {
            ui.bubbles.style.opacity = "1";
            ui.bubbles.style.height = ui.liquid.style.height;
            ui.bubbles.classList.add("fizzing");
            setTimeout(() => {
                ui.bubbles.style.opacity = "0";
                ui.bubbles.classList.remove("fizzing");
            }, 3000);
        }

        // Guardar la corrida actual en la tabla rápida para copiar datos
        table.agua.innerText = agua.toFixed(1) + " %";
        table.vinagre.innerText = vinagre.toFixed(1) + " %";
        table.bicarbonato.innerText = bicarbonato.toFixed(1) + " %";
        table.temp.innerText = temp + " °C";
        table.ph.innerText = ph.toFixed(2);
    }

    // Monitorear cambios conforme el usuario escribe o usa las flechas
    inputs.agua.addEventListener("input", verificarRestricciones);
    inputs.vinagre.addEventListener("input", verificarRestricciones);
    inputs.bicarbonato.addEventListener("input", verificarRestricciones);
    inputs.temp.addEventListener("input", () => {
        if (inputs.temp.value < 0) inputs.temp.value = 0;
    });

    ui.btnCalcular.addEventListener("click", calcularResultadosExperimento);

    // Inicializar el estado de la celda de simulación
    verificarRestricciones();
});
