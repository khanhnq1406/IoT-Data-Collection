function y = calculateChirp(f0, f1, T, fs)
    % Tính toán sóng Chirp v?i t?n s? ban ??u f0, t?n s? k?t thúc f1, th?i gian tr?i qua T và t?n s? l?y m?u fs.
    % Tr? l?i vect? sóng Chirp
    t = linspace(0, T, T*fs); % t?o vect? th?i gian
    y = sin(2*pi*f0*T*(f1/f0).^(t/T-1)/(log(f1/f0))); % tính toán giá tr? sóng Chirp t?i t?ng th?i ?i?m
end