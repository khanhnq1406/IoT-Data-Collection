function y = calculateChirp(f0, f1, T, fs)
    % T�nh to�n s�ng Chirp v?i t?n s? ban ??u f0, t?n s? k?t th�c f1, th?i gian tr?i qua T v� t?n s? l?y m?u fs.
    % Tr? l?i vect? s�ng Chirp
    t = linspace(0, T, T*fs); % t?o vect? th?i gian
    y = sin(2*pi*f0*T*(f1/f0).^(t/T-1)/(log(f1/f0))); % t�nh to�n gi� tr? s�ng Chirp t?i t?ng th?i ?i?m
end