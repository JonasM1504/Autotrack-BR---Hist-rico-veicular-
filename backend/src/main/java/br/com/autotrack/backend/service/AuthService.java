package br.com.autotrack.backend.service;

import br.com.autotrack.backend.config.JwtService;
import br.com.autotrack.backend.dto.LoginRequestDTO;
import br.com.autotrack.backend.dto.LoginResponseDTO;
import br.com.autotrack.backend.exception.BusinessException;
import br.com.autotrack.backend.model.User;
import br.com.autotrack.backend.model.UserRole;
import br.com.autotrack.backend.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository, JwtService jwtService, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.passwordEncoder = passwordEncoder;
    }

    public LoginResponseDTO login(LoginRequestDTO dto) {
        String email = dto.getEmail().toLowerCase().trim();
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new BusinessException("Email ou senha incorretos"));
        if (!passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
            throw new BusinessException("Email ou senha incorretos");
        }
        String token = jwtService.generateToken(user.getEmail(), user.getRole().name());
        return new LoginResponseDTO(token, user.getEmail(), user.getRole().name());
    }

    public LoginResponseDTO register(LoginRequestDTO dto) {
        String email = dto.getEmail().toLowerCase().trim();
        if (userRepository.findByEmail(email).isPresent()) {
            throw new BusinessException("Email já cadastrado");
        }
        User user = User.builder()
            .email(email)
            .password(passwordEncoder.encode(dto.getPassword()))
            .role(UserRole.USER)
            .build();
        userRepository.save(user);
        String token = jwtService.generateToken(user.getEmail(), user.getRole().name());
        return new LoginResponseDTO(token, user.getEmail(), user.getRole().name());
    }
}